import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "AI Agents | TechRover",
  description: "Custom AI agents and chatbots that automate support, sales and operations.",
  alternates: { canonical: "https://techrover.co.in/ai-agents" },
  openGraph: { title: "AI Agents | TechRover", description: "Custom AI agents and chatbots that automate support, sales and operations.", url: "https://techrover.co.in/ai-agents", siteName: 'TechRover', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
