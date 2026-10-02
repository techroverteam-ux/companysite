import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact TechRover | TechRover",
  description: "Talk to TechRover about your AI, ERP, web or marketing project. We reply within one working day.",
  alternates: { canonical: "https://techrover.co.in/contact" },
  openGraph: { title: "Contact TechRover | TechRover", description: "Talk to TechRover about your AI, ERP, web or marketing project. We reply within one working day.", url: "https://techrover.co.in/contact", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
