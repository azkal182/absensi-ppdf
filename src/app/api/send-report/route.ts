// import { NextResponse } from 'next/server';
// import { getDaftarAlfa } from '@/actions/absenAction';
// import { format, toZonedTime } from 'date-fns-tz';
// import { id } from 'date-fns/locale';
// import { getReportWhatsapp } from '@/actions/report_whatsapp';

// const API_URL = 'http://165.22.106.176:3030/absensi/messages/send/bulk';
// const API_KEY = 'a24ebffc8739bfb85cebf8446605a0cd670012cbbc878af2a4e1af1ded72e578';
// const TOKEN_TELEGRAM = '7797810278:AAFE0O8oz-0rU0XYwkBDVwOK61j4ZxX40t4';
// const JAKARTA_TIMEZONE = 'Asia/Jakarta';

// // 🔹 Fungsi untuk mendapatkan tanggal hari ini di zona waktu Jakarta
// function getTodayInJakarta() {
//     const now = new Date();
//     const jakartaDate = toZonedTime(now, JAKARTA_TIMEZONE);
//     return format(jakartaDate, 'yyyy-MM-dd', { timeZone: JAKARTA_TIMEZONE });
// }

// // 🔹 Fungsi untuk memformat tanggal ke "Hari, DD MMMM YYYY"
// function formatDate(dateString: string): string {
//     const utcDate = new Date(dateString + 'T00:00:00Z'); // Pastikan dalam UTC
//     const jakartaDate = toZonedTime(utcDate, JAKARTA_TIMEZONE);
//     return format(jakartaDate, 'EEEE, dd MMMM yyyy', { locale: id });
// }

// // 🔹 Fungsi untuk mengirim pesan WhatsApp
// async function sendWhatsAppMessages(payload: any[]) {
//     try {
//         if (payload.length === 0) return;

//         const requestOptions = {
//             method: 'POST',
//             headers: {
//                 'X-API-Key': API_KEY,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload),
//         };

//         const response = await fetch(API_URL, requestOptions);
//         const responseData = await response.text();
//         console.log('✅ WhatsApp API Response:', responseData);
//     } catch (error) {
//         console.error('❌ Gagal mengirim pesan WhatsApp:', error);
//     }
// }

// // 🔹 Fungsi untuk mengirim pesan Telegram
// async function sendTelegramMessages(payloads: any[]) {
//     try {
//         if (payloads.length === 0) return;

//         await Promise.all(payloads.map((payload) => fetch(payload.url, payload.options)));
//         console.log('✅ Semua pesan Telegram berhasil dikirim');
//     } catch (error) {
//         console.error('❌ Gagal mengirim pesan Telegram:', error);
//     }
// }

// export async function GET() {
//     try {
//         // 🔹 Ambil data daftar alfa
//         const result: any[] | { error: string } = await getDaftarAlfa();

//         if ('error' in result) {
//             return NextResponse.json({ error: result.error }, { status: 500 });
//         }

//         if (!Array.isArray(result) || result.length === 0) {
//             return NextResponse.json({ error: 'No data available' }, { status: 404 });
//         }

//         // 🔹 Ambil daftar nomor WhatsApp & Telegram
//         const listJid = await getReportWhatsapp();

//         // 🔹 Ambil tanggal & formatnya
//         const today = getTodayInJakarta();
//         const formattedDate = formatDate(today);

//         // 🔹 Format pesan laporan
//         let messageText = `📋 *Laporan Absensi PPDF*\n📅 ${formattedDate}\n\n`;

//         result.forEach(({ name, siswa, jumlahAlfa }) => {
//             messageText += `🏫 *${name} - ${jumlahAlfa} santri*\n`;

//             siswa.forEach((student: any, index: number) => {
//                 const jamKeList = student.alfa.map((a: any) => a.jamKe.join(', ')).join('; ');
//                 messageText += `${index + 1}. ${student.name} (Jam ke: ${jamKeList})\n`;
//             });

//             messageText += `\n`; // Baris kosong antar sekolah
//         });

//         // 🔹 Payload untuk WhatsApp
//         const payloadWhatsApp = listJid
//             .filter((data) => data.jid && data.whatsapp)
//             .map((data) => ({
//                 jid: data.jid,
//                 type: data.type === 'GROUP' ? 'group' : 'number',
//                 message: { text: messageText.trim() },
//                 delay: 3000,
//             }));

//         // 🔹 Payload untuk Telegram
//         const payloadTelegram = listJid
//             .filter((data) => data.telegramId && data.telegram)
//             .map((data) => ({
//                 url: `https://api.telegram.org/bot${TOKEN_TELEGRAM}/sendMessage`,
//                 options: {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         chat_id: data.telegramId,
//                         text: messageText.trim(),
//                     }),
//                 },
//             }));

//         // 🔹 Kirim pesan secara paralel
//         await Promise.all([sendWhatsAppMessages(payloadWhatsApp), sendTelegramMessages(payloadTelegram)]);

//         return NextResponse.json({ message: '✅ Pesan berhasil dikirim!', data: result });
//     } catch (error) {
//         console.error('❌ Error fetching daftar alfa:', error);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server'
import { generatePdf } from '@/actions/report_whatsapp'

// 🔹 Mengirim laporan absensi ke WhatsApp & Telegram

// 🔹 API Handler (GET)
export async function GET() {
  try {
    // const response = await sendAbsensiReport()
    const response = await generatePdf()
    // return NextResponse.json(response)
    return new NextResponse(response, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="absensi.pdf"',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
