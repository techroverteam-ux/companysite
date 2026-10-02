import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Products | TechRover",
  description: "Ready-to-deploy TechRover products: CRM, inventory, LMS, e-commerce and chatbot platforms.",
  alternates: { canonical: "https://techrover.co.in/products" },
  openGraph: { title: "Products | TechRover", description: "Ready-to-deploy TechRover products: CRM, inventory, LMS, e-commerce and chatbot platforms.", url: "https://techrover.co.in/products", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
