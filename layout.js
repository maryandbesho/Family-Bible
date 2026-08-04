export const metadata = {
  title: 'Bible App',
  description: 'A family Bible reading app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Georgia, serif' }}>{children}</body>
    </html>
  )
}
