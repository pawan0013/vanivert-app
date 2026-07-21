import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://vanivert.eu'),
  title: { default: 'Vanivert — IA immobilière pour agences françaises', template: '%s — Vanivert' },
  description: 'Vanivert automatise l\'intégralité du cycle immobilier. IA vocale, CRM centralisé, planification de visites, relation client à vie, avis Google automatiques.',
  keywords: ['IA immobilière', 'agence immobilière', 'CRM immobilier', 'voice AI', 'SeLoger', 'LeBonCoin', 'BienIci', 'automatisation agence', 'France'],
  authors: [{ name: 'Vanivert', url: 'https://vanivert.eu' }],
  creator: 'Vanivert',
  openGraph: {
    title: 'Vanivert — L\'agence immobilière qui ne dort jamais',
    description: 'IA vocale, CRM centralisé, visites planifiées, avis Google automatiques. Tout le cycle immobilier en pilote automatique.',
    url: 'https://vanivert.eu',
    siteName: 'Vanivert',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Vanivert' }],
  },
  twitter: { card: 'summary_large_image', title: 'Vanivert — IA immobilière', description: 'L\'agence immobilière qui ne dort jamais.', images: ['/og-image.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  other: { 'theme-color': '#FFFFFF' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
