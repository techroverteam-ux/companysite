import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Portfolio | TechRover",
  description: "Projects TechRover has delivered: ERP systems, e-commerce stores, AI assistants and business websites.",
  alternates: { canonical: "https://techrover.co.in/portfolio" },
  openGraph: { title: "Portfolio | TechRover", description: "Projects TechRover has delivered: ERP systems, e-commerce stores, AI assistants and business websites.", url: "https://techrover.co.in/portfolio", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
