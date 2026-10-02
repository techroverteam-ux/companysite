import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Hire a Dedicated Team | TechRover",
  description: "Hire dedicated developers, designers and QA engineers from TechRover.",
  alternates: { canonical: "https://techrover.co.in/hire-team" },
  openGraph: { title: "Hire a Dedicated Team | TechRover", description: "Hire dedicated developers, designers and QA engineers from TechRover.", url: "https://techrover.co.in/hire-team", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
