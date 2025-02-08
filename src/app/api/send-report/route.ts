import { NextResponse } from 'next/server'
import { getDaftarAlfa } from '@/actions/absenAction'
import { format, toZonedTime } from 'date-fns-tz'
import { id } from 'date-fns/locale'

const API_URL = 'http://165.22.106.176:3030/absensi/messages/send'
const API_KEY =
  'a24ebffc8739bfb85cebf8446605a0cd670012cbbc878af2a4e1af1ded72e578'
const JAKARTA_TIMEZONE = 'Asia/Jakarta'

// Fungsi untuk mendapatkan tanggal hari ini di zona waktu Jakarta
function getTodayInJakarta() {
  const now = new Date()
  const jakartaDate = toZonedTime(now, JAKARTA_TIMEZONE)
  return format(jakartaDate, 'yyyy-MM-dd', { timeZone: JAKARTA_TIMEZONE })
}

// Fungsi untuk memformat tanggal ke "Hari, DD MMMM YYYY"
function formatDate(dateString: string): string {
  const utcDate = new Date(dateString + 'T00:00:00Z') // Pastikan dalam UTC
  const jakartaDate = toZonedTime(utcDate, JAKARTA_TIMEZONE)
  return format(jakartaDate, 'EEEE, dd MMMM yyyy', { locale: id })
}

export async function GET() {
  try {
    const result: any[] | { error: string } = await getDaftarAlfa()

    // Jika result berupa error object, langsung return error
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Jika result kosong atau tidak memiliki data
    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json({ error: 'No data available' }, { status: 404 })
    }

    // Ambil tanggal dari data pertama atau fallback ke tanggal hari ini di Jakarta
    const today = getTodayInJakarta()
    const formattedDate = formatDate(today)

    // Format pesan WhatsApp
    let messageText = `📋 *Laporan Absensi PPDF*\n📅 ${formattedDate}\n\n`

    result.forEach(({ name, siswa, jumlahAlfa }) => {
      messageText += `🏫 *${name} - ${jumlahAlfa} santri*\n`

      siswa.forEach((student: any, index: any) => {
        const jamKeList = student.alfa
          .map((a: any) => a.jamKe.join(', '))
          .join('; ')
        messageText += `${index + 1}. ${student.name} (Jam ke: ${jamKeList})\n`
      })

      messageText += `\n` // Tambahkan baris kosong antar sekolah
    })

    const payload = {
      jid: '120363379009716100@g.us',
      type: 'group',
      message: {
        text: messageText.trim(), // Hapus spasi atau newline berlebih
      },
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }

    try {
      await fetch(API_URL, requestOptions)
      // const responseData = await response.text()
      //   console.log('WhatsApp API Response:', responseData)
    } catch (whatsappError) {
      console.error('Failed to send WhatsApp message:', whatsappError)
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Error fetching daftar alfa:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
