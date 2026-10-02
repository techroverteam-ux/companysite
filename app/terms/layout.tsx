import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Terms of Service | TechRover",
  description: "Terms that apply when you use the TechRover website and services.",
  alternates: { canonical: "https://techrover.co.in/terms" },
  openGraph: { title: "Terms of Service | TechRover", description: "Terms that apply when you use the TechRover website and services.", url: "https://techrover.co.in/terms", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
