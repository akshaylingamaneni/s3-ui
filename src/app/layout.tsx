import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'S3 UI',
  description: 'A modern S3 UI built with Next.js 15',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.className} antialiased`}>
      <body className="min-h-screen bg-background subpixel-antialiased">
        {children}
      </body>
    </html>
  )
}
