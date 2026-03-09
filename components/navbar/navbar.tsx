'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, ChevronDown } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navItems = [
    { href: '/', label: 'Home' },
    {
      label: 'Services',
      dropdown: [
        { href: '/services', label: 'All Services' },
        { href: '/services#web-development', label: 'Web Development' },
        { href: '/services#ai-development', label: 'AI Development' },
        { href: '/services#shopify-development', label: 'Shopify Development' },
        { href: '/services#erp-systems', label: 'ERP Systems' },
        { href: '/services#digital-marketing', label: 'Digital Marketing' },
        { href: '/services#branding-design', label: 'Branding & Design' }
      ]
    },
    {
      label: 'Solutions',
      dropdown: [
        { href: '/shopify', label: 'Shopify Store' },
        { href: '/migration', label: 'Migration Services' },
        { href: '/ai-agents', label: 'AI Agents' },
        { href: '/calculator', label: 'Cost Calculator' },
        { href: '/collaborate', label: 'Collaborate' },
        { href: '/products', label: 'Products' },
        { href: '/new-year-2026', label: '🎊 New Year 2026 Offers' }
      ]
    },
    {
      label: 'Company',
      dropdown: [
        { href: '/about', label: 'About Us' },
        { href: '/team', label: 'Our Team' },
        { href: '/hire-team', label: 'Hire Team' },
        { href: '/portfolio', label: 'Portfolio' },
        { href: '/reviews', label: 'Reviews' }
      ]
    },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0557d6] to-[#00a995] shadow-sm">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-[1.1rem] font-semibold tracking-tight text-foreground sm:text-xl">Techrover</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex lg:gap-4">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current)
                      }
                      setActiveDropdown(item.label)
                    }}
                    onMouseLeave={() => {
                      timeoutRef.current = setTimeout(() => {
                        setActiveDropdown(null)
                      }, 150)
                    }}
                  >
                    <button className="flex items-center rounded-lg px-4 py-2.5 text-[0.95rem] font-medium tracking-[0.01em] text-foreground/80 transition-colors hover:bg-accent hover:text-foreground">
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="absolute left-0 top-full z-50 mt-3 w-60 rounded-xl border border-border bg-popover/95 py-2 text-popover-foreground shadow-lg">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="mx-2 block rounded-lg px-3 py-2.5 text-sm tracking-[0.01em] text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    className="rounded-lg px-4 py-2.5 text-[0.95rem] font-medium tracking-[0.01em] text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Button asChild variant="gradient" size="sm" className="h-10 px-5 text-[0.9rem] tracking-[0.01em]">
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-border bg-background px-2 pb-4 pt-2 sm:px-3">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <div>
                      <button
                        className="flex w-full items-center justify-between px-3 py-3 font-medium text-foreground"
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.label && (
                        <div className="mb-1 space-y-0.5 border-l-2 border-primary/20 ml-3">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground active:bg-accent"
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className="block px-3 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground active:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="px-3 pt-3">
                <Button asChild variant="gradient" size="sm" className="w-full h-11">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>Get Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}