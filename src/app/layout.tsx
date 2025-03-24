import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { ThemeProviderWrapper } from '@/components/ui/theme-provider-wrapper'

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
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ClerkProvider>
          <ThemeProviderWrapper>
            {children}
          </ThemeProviderWrapper>
        </ClerkProvider>
      </body>
    </html>
  )
}
