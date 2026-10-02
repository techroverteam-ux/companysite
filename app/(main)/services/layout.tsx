import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Services | TechRover",
  description: "AI solutions, ERP, custom web and app development, Shopify and digital marketing services from TechRover.",
  alternates: { canonical: "https://techrover.co.in/services" },
  openGraph: { title: "Services | TechRover", description: "AI solutions, ERP, custom web and app development, Shopify and digital marketing services from TechRover.", url: "https://techrover.co.in/services", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
