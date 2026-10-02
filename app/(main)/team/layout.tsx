import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Our Team | TechRover",
  description: "Meet the TechRover developers, designers and project managers.",
  alternates: { canonical: "https://techrover.co.in/team" },
  openGraph: { title: "Our Team | TechRover", description: "Meet the TechRover developers, designers and project managers.", url: "https://techrover.co.in/team", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
