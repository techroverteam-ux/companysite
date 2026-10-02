import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Collaborate with TechRover | TechRover",
  description: "Partner with TechRover on products, referrals and joint projects.",
  alternates: { canonical: "https://techrover.co.in/collaborate" },
  openGraph: { title: "Collaborate with TechRover | TechRover", description: "Partner with TechRover on products, referrals and joint projects.", url: "https://techrover.co.in/collaborate", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
