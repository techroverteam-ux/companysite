import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Privacy Policy | TechRover",
  description: "How TechRover collects, uses and protects your information.",
  alternates: { canonical: "https://techrover.co.in/privacy-policy" },
  openGraph: { title: "Privacy Policy | TechRover", description: "How TechRover collects, uses and protects your information.", url: "https://techrover.co.in/privacy-policy", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
