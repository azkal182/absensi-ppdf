import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import NextTopLoader from 'nextjs-toploader'
import Providers from './provider'
import Head from 'next/head'
import { auth } from '@/auth'
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <Head>
        <meta name="googlebot" content="notranslate" />
        <meta name="google" content="notranslate" />
      </Head>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Providers session={session}>
          <ProressBarProviders>
            {children}
            <Toaster />
          </ProressBarProviders>
        </Providers> */}
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <Providers session={session}>
            <Toaster />
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  )
}
