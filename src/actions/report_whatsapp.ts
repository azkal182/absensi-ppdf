'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getDaftarAlfa } from '@/actions/absenAction'
import { format, toZonedTime } from 'date-fns-tz'
import { id } from 'date-fns/locale'

const API_URL = 'http://165.22.106.176:3030/absensi/messages/send/bulk'
const API_KEY =
  'a24ebffc8739bfb85cebf8446605a0cd670012cbbc878af2a4e1af1ded72e578'
const TOKEN_TELEGRAM = '7797810278:AAFE0O8oz-0rU0XYwkBDVwOK61j4ZxX40t4'
const JAKARTA_TIMEZONE = 'Asia/Jakarta'

// 🔹 Mendapatkan tanggal hari ini di zona Jakarta
function getTodayInJakarta() {
  const now = new Date()
  const jakartaDate = toZonedTime(now, JAKARTA_TIMEZONE)
  return format(jakartaDate, 'yyyy-MM-dd', { timeZone: JAKARTA_TIMEZONE })
}

// 🔹 Memformat tanggal ke "Hari, DD MMMM YYYY"
function formatDate(dateString: string): string {
  const utcDate = new Date(dateString + 'T00:00:00Z')
  const jakartaDate = toZonedTime(utcDate, JAKARTA_TIMEZONE)
  return format(jakartaDate, 'EEEE, dd MMMM yyyy', { locale: id })
}
// Get all reports
export const getReportWhatsapp = async () => {
  try {
    const result = await prisma.reportWhatsapp.findMany()

    return result
  } catch (error) {
    console.error('Error fetching reportWhatsapp data:', error)
    throw new Error('Gagal mengambil data report WhatsApp')
  }
}

// Get report by ID
export const getReportWhatsappById = async (id: string) => {
  try {
    const result = await prisma.reportWhatsapp.findUnique({
      where: { id: parseInt(id) },
    })
    return result
  } catch (error) {
    console.error('Error fetching reportWhatsapp by ID:', error)
    throw new Error('Gagal mengambil data report WhatsApp berdasarkan ID')
  }
}

// Create new report
export const createReportWhatsapp = async (data: {
  name: string
  jid: string
  type: 'GROUP' | 'PERSONAL'
  active: boolean
}) => {
  try {
    const newReport = await prisma.reportWhatsapp.create({
      data,
    })
    revalidatePath('/report-whatsapp')

    return newReport
  } catch (error) {
    console.error('Error creating reportWhatsapp:', error)
    throw new Error('Gagal menambahkan data report WhatsApp')
  }
}

// Update report
export const updateReportWhatsapp = async (
  id: string,
  data: {
    name?: string
    jid?: string
    type?: 'GROUP' | 'PERSONAL'
    active?: boolean
  }
) => {
  try {
    const updatedReport = await prisma.reportWhatsapp.update({
      where: { id: parseInt(id) },
      data,
    })
    revalidatePath('/report-whatsapp')

    return updatedReport
  } catch (error) {
    console.error('Error updating reportWhatsapp:', error)
    throw new Error('Gagal memperbarui data report WhatsApp')
  }
}

// Delete report
export const deleteReportWhatsapp = async (id: string) => {
  try {
    await prisma.reportWhatsapp.delete({
      where: { id: parseInt(id) },
    })
    revalidatePath('/report-whatsapp')

    return { message: 'Data berhasil dihapus' }
  } catch (error) {
    console.error('Error deleting reportWhatsapp:', error)
    throw new Error('Gagal menghapus data report WhatsApp')
  }
}

// 🔹 Mengirim pesan WhatsApp
export async function sendWhatsAppMessages(payload: any[]) {
  if (payload.length === 0) return

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const responseData = await response.text()
    console.log('✅ WhatsApp API Response:', responseData)
  } catch (error) {
    console.error('❌ Gagal mengirim pesan WhatsApp:', error)
  }
}

// 🔹 Mengirim pesan Telegram
export async function sendTelegramMessages(payloads: any[]) {
  if (payloads.length === 0) return

  try {
    await Promise.all(
      payloads.map((payload) => fetch(payload.url, payload.options))
    )
    console.log('✅ Semua pesan Telegram berhasil dikirim')
  } catch (error) {
    console.error('❌ Gagal mengirim pesan Telegram:', error)
  }
}

// 🔹 Membuat pesan laporan berdasarkan daftar alfa
// export async function generateReportMessage(): Promise<{
//   message: string
//   data: any[]
// }> {
//   const result: any[] | { error: string } = await getDaftarAlfa()

//   if ('error' in result || !Array.isArray(result) || result.length === 0) {
//     throw new Error('Data tidak tersedia atau terjadi kesalahan.')
//   }

//   const today = getTodayInJakarta()
//   const formattedDate = formatDate(today)

//   let messageText = `📋 *Laporan Absensi PPDF*\n📅 ${formattedDate}\n\n`

//   result.forEach(({ name, siswa, jumlahAlfa }) => {
//     messageText += `🏫 *${name} - ${jumlahAlfa} santri*\n`
//     siswa.forEach((student: any, index: number) => {
//       const jamKeList = student.alfa
//         .map((a: any) => a.jamKe.join(', '))
//         .join('; ')
//       messageText += `${index + 1}. ${student.name} (Jam ke: ${jamKeList})\n`
//     })
//     messageText += `\n`
//   })

//   return { message: messageText.trim(), data: result }
// }

interface Student {
  name: string
  alfa: { jamKe: number[] }[]
}

interface Kelas {
  name: string
  teacher: string
  siswa: Student[]
}

interface Asrama {
  name: string
  jumlahAlfa: number
  kelas: Kelas[]
}
export async function generateReportMessage(): Promise<{
  message: string
  data: Asrama[]
}> {
  const result: any[] | { error: string } = await getDaftarAlfa()

  if ('error' in result || !Array.isArray(result) || result.length === 0) {
    throw new Error('Data tidak tersedia atau terjadi kesalahan.')
  }

  const today = getTodayInJakarta()
  const formattedDate = formatDate(today)

  if ('error' in result) {
    throw new Error('Gagal mengirim laporan absensi.')
  }

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('Data tidak tersedia atau terjadi kesalahan.')
  }

  let messageText = `📋 *Laporan Absensi PPDF*\n📅 ${formattedDate}\n\n`

  result.forEach(
    ({ name: asramaName, kelas, jumlahAlfaPengurus, jumlahAlfaSantri }) => {
      messageText += `🏫 *${asramaName} - ${jumlahAlfaSantri} santri - ${jumlahAlfaPengurus} Pengurus*\n`
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      kelas.forEach(({ name: kelasName, teacher, siswa }) => {
        messageText += `  📚 *Kelas ${kelasName} - ${teacher}*\n`
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        siswa.forEach((student, index) => {
          const jamKeList = student.alfa
            .map((a: any) => a.jamKe.join(', '))
            .join('; ')

          messageText += `    ${index + 1}. ${student.name} (${jamKeList}) ${student?.pengurusName ? '*' + student?.pengurusName + '*' : ''}\n`
        })
        messageText += `\n`
      })
    }
  )

  return { message: messageText.trim(), data: result }
}

// Fungsi untuk mengirim pesan berdasarkan ID
export async function sendAbsensiReportById(id: number) {
  try {
    // 🔹 Ambil data daftar alfa
    const result: any[] | { error: string } = await getDaftarAlfa()

    if ('error' in result) {
      throw new Error('Gagal mengirim laporan absensi.')
    }

    if (!Array.isArray(result) || result.length === 0) {
      throw new Error('Data tidak tersedia atau terjadi kesalahan.')
    }
    console.log(JSON.stringify(result, null, 2))

    // 🔹 Ambil daftar nomor WhatsApp & Telegram
    const listJid = await getReportWhatsapp()

    // 🔹 Filter listJid berdasarkan id yang diberikan
    const filteredJid = listJid.filter((data) => data.id === id)

    if (filteredJid.length === 0) {
      throw new Error('No matching id found')
    }

    // 🔹 Ambil tanggal & formatnya
    const today = getTodayInJakarta()
    const formattedDate = formatDate(today)

    // 🔹 Format pesan laporan
    let messageText = `📋 *Laporan Absensi PPDF*\n📅 ${formattedDate}\n\n`

    result.forEach(
      ({ name: asramaName, kelas, jumlahAlfaPengurus, jumlahAlfaSantri }) => {
        messageText += `🏫 *${asramaName} - ${jumlahAlfaSantri} santri - ${jumlahAlfaPengurus} Pengurus*\n`
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        kelas.forEach(({ name: kelasName, teacher, siswa }) => {
          messageText += `  📚 *Kelas ${kelasName} - ${teacher}*\n`
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          siswa.forEach((student, index) => {
            const jamKeList = student.alfa
              .map((a: any) => a.jamKe.join(', '))
              .join('; ')

            messageText += `    ${index + 1}. ${student.name} (${jamKeList}) ${student?.pengurusName ? '*' + student?.pengurusName + '*' : ''}\n`
          })
          messageText += `\n`
        })
      }
    )

    // 🔹 Payload untuk WhatsApp
    const payloadWhatsApp = filteredJid
      .filter((data) => data.jid && data.whatsapp)
      .map((data) => ({
        jid: data.jid,
        type: data.type === 'GROUP' ? 'group' : 'number',
        message: { text: messageText.trim() },
        delay: 3000,
      }))

    // 🔹 Payload untuk Telegram
    const payloadTelegram = filteredJid
      .filter((data) => data.telegramId && data.telegram)
      .map((data) => ({
        url: `https://api.telegram.org/bot${TOKEN_TELEGRAM}/sendMessage`,
        options: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: data.telegramId,
            text: messageText.trim(),
          }),
        },
      }))

    // 🔹 Kirim pesan secara paralel
    await Promise.all([
      sendWhatsAppMessages(payloadWhatsApp),
      sendTelegramMessages(payloadTelegram),
    ])

    return { message: '✅ Pesan berhasil dikirim!', data: result }
  } catch (error) {
    console.error('❌ Error fetching daftar alfa:', error)
    throw new Error('Internal Server Error')
  }
}

export async function sendAbsensiReport() {
  try {
    const listJid = await getReportWhatsapp()
    const { message, data } = await generateReportMessage()

    const payloadWhatsApp = listJid
      .filter((data) => data.jid && data.whatsapp)
      .map((data) => ({
        jid: data.jid,
        type: data.type === 'GROUP' ? 'group' : 'number',
        message: { text: message },
        delay: 3000,
      }))

    const payloadTelegram = listJid
      .filter((data) => data.telegramId && data.telegram)
      .map((data) => ({
        url: `https://api.telegram.org/bot${TOKEN_TELEGRAM}/sendMessage`,
        options: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: data.telegramId,
            text: message,
          }),
        },
      }))

    await Promise.all([
      sendWhatsAppMessages(payloadWhatsApp),
      sendTelegramMessages(payloadTelegram),
    ])

    return { message: '✅ Pesan berhasil dikirim!', data }
  } catch (error) {
    console.error('❌ Error sending report:', error)
    throw new Error('Gagal mengirim laporan absensi.')
  }
}
