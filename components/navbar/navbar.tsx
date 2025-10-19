'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, ChevronDown } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

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
        { href: '/products', label: 'Products' }
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
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold gradient-text">Techrover</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium">
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
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
                    className="text-gray-700 hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Button variant="gradient" size="sm" onClick={() => window.location.href = '/contact'}>
              Get Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <div>
                      <div className="px-3 py-2 text-gray-700 font-medium border-b border-gray-100">
                        {item.label}
                      </div>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-6 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="px-3 py-2">
                <Button variant="gradient" size="sm" className="w-full" onClick={() => window.location.href = '/contact'}>
                  Get Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}