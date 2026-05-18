import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DevInsight AI - AI-Powered Code Review Platform',
  description: 'Automated code review and analysis powered by IBM watsonx AI. Transform your code with intelligent insights.',
  keywords: 'code review, AI, IBM watsonx, automated testing, code quality',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

// Made with Bob
