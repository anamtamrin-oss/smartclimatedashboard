import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Climate Budget AI-Analyzer - IDEA',
  description: 'Platform untuk menganalisis dokumen anggaran pemerintah daerah dengan Climate Budget Tagging otomatis menggunakan AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
