import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About TechRover | TechRover",
  description: "Who we are: a technology partner for AI, ERP, web development and digital marketing, based in India and working worldwide.",
  alternates: { canonical: "https://techrover.co.in/about" },
  openGraph: { title: "About TechRover | TechRover", description: "Who we are: a technology partner for AI, ERP, web development and digital marketing, based in India and working worldwide.", url: "https://techrover.co.in/about", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
