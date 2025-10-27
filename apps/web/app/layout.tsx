import './globals.css'
import './backgrounds.css'

export const metadata = {
  title: 'glyphd',
  description: 'Make your mark',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
