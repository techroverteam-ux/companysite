import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shopify Store Development | TechRover",
  description: "Shopify store setup, themes, apps and migrations by TechRover.",
  alternates: { canonical: "https://techrover.co.in/shopify" },
  openGraph: { title: "Shopify Store Development | TechRover", description: "Shopify store setup, themes, apps and migrations by TechRover.", url: "https://techrover.co.in/shopify", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
