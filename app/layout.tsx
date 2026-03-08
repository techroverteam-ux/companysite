import type { Metadata } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Techrover - Global Technology Solutions | AI, ERP, Web Development',
  description: 'Leading technology partner delivering AI solutions, ERP systems, web development, and digital marketing services to businesses worldwide.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const storedTheme = localStorage.getItem('theme');
              const theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'light';
              document.documentElement.classList.toggle('dark', theme === 'dark');
              document.documentElement.style.colorScheme = theme;
            })();`,
          }}
        />
      </head>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} bg-background text-foreground transition-colors duration-300`}>
        <main>{children}</main>
      </body>
    </html>
  )
}