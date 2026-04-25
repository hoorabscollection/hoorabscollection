import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: "Hoorab's Collection — Pakistani Bridal & Casual Wear | London",
  description: 'Exquisite Pakistani bridal and casual wear delivered across the UK. Bridal lehengas, casual suits, formal wear and accessories.',
  keywords: 'Pakistani clothes UK, bridal wear London, Asian fashion UK, Pakistani suits London',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {children}
        <Toaster position="bottom-right" toastOptions={{
          style: { background: '#1A0A0A', color: '#FAF7F0', fontFamily: 'DM Sans' }
        }}/>
      </body>
    </html>
  )
}
