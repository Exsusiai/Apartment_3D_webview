import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MemoSpace',
  description: 'Immersive 3D Memories of the Places I\'ve Lived - A 3D Remembrance Project',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
