import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import ProressBarProviders from '@/components/progress-bar-provider'
import Providers from './provider'
// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
//   display: 'swap',
//   adjustFontFallback: false,
// })
//
// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
//   display: 'swap',
//   adjustFontFallback: false,
// })

export const metadata: Metadata = {
  title: 'SIGAP',
  description: 'Sistem Digital Absensi PPDF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ProressBarProviders>
            {children}
            <Toaster />
          </ProressBarProviders>
        </Providers>
      </body>
    </html>
  )
}
