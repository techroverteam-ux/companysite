import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Book a Meeting | TechRover",
  description: "Book a free consultation or technical call with the TechRover team.",
  alternates: { canonical: "https://techrover.co.in/schedule" },
  openGraph: { title: "Book a Meeting | TechRover", description: "Book a free consultation or technical call with the TechRover team.", url: "https://techrover.co.in/schedule", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
