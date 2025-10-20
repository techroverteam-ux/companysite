import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar/navbar'
import { Footer } from '@/components/footer/footer'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Techrover - Global Technology Solutions | AI, ERP, Web Development',
  description: 'Leading technology partner delivering AI solutions, ERP systems, web development, and digital marketing services to businesses worldwide.',
  keywords: 'AI development, ERP systems, web development, digital marketing, technology solutions, software development',
  authors: [{ name: 'Techrover' }],
  creator: 'Techrover',
  publisher: 'Techrover',
  openGraph: {
    title: 'Techrover - Global Technology Solutions',
    description: 'Transform your business with cutting-edge AI, ERP, and web development solutions.',
    url: 'https://techrover.co.in',
    siteName: 'Techrover',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Techrover - Technology Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Techrover - Global Technology Solutions',
    description: 'Transform your business with cutting-edge technology solutions.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}