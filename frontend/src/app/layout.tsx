import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevInsight AI - AI-Powered Code Review Platform',
  description: 'Automated code review and analysis powered by IBM watsonx AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// Made with Bob
