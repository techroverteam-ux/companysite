import type { Metadata } from 'next'

// Private client pages: never indexed, never cached by search engines.
export const metadata: Metadata = { title: 'TechRover', robots: { index: false, follow: false } }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-800">{children}</div>
}
