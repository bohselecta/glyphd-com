import './globals.css'
import './backgrounds.css'
import { inter, jetmono } from './fonts'

export const metadata = {
  title: 'glyphd',
  description: 'Make your mark',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetmono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
