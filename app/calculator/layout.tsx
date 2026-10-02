import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Project Cost Calculator | TechRover",
  description: "Estimate the cost of your website, app or ERP project in a few clicks.",
  alternates: { canonical: "https://techrover.co.in/calculator" },
  openGraph: { title: "Project Cost Calculator | TechRover", description: "Estimate the cost of your website, app or ERP project in a few clicks.", url: "https://techrover.co.in/calculator", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
