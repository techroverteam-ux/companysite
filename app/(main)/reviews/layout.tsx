import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Client Reviews | TechRover",
  description: "What clients say about working with TechRover, including verified reviews from completed projects.",
  alternates: { canonical: "https://techrover.co.in/reviews" },
  openGraph: { title: "Client Reviews | TechRover", description: "What clients say about working with TechRover, including verified reviews from completed projects.", url: "https://techrover.co.in/reviews", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
