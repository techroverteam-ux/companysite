import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Migration Services | TechRover",
  description: "Move your website, store or data to a modern platform with zero data loss.",
  alternates: { canonical: "https://techrover.co.in/migration" },
  openGraph: { title: "Migration Services | TechRover", description: "Move your website, store or data to a modern platform with zero data loss.", url: "https://techrover.co.in/migration", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
