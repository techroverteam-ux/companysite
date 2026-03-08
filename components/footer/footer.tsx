import Link from 'next/link'
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/30 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0557d6] to-[#00a995] shadow-sm">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Techrover</span>
            </div>
            <p className="mb-4 max-w-md text-muted-foreground">
              Global technology partner delivering cutting-edge AI, ERP, Web Development, 
              and Digital Marketing solutions to businesses worldwide.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="LinkedIn" className="rounded-full border border-border bg-background p-2 text-muted-foreground transition-colors hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Twitter" className="rounded-full border border-border bg-background p-2 text-muted-foreground transition-colors hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Facebook" className="rounded-full border border-border bg-background p-2 text-muted-foreground transition-colors hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About Us</Link></li>
              <li><Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">Services</Link></li>
              <li><Link href="/products" className="text-muted-foreground transition-colors hover:text-foreground">Products</Link></li>
              <li><Link href="/migration" className="text-muted-foreground transition-colors hover:text-foreground">Migration</Link></li>
              <li><Link href="/ai-agents" className="text-muted-foreground transition-colors hover:text-foreground">AI Agents</Link></li>
              <li><Link href="/collaborate" className="text-muted-foreground transition-colors hover:text-foreground">Collaborate</Link></li>
              <li><Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-secondary" />
                <span className="text-muted-foreground">hello@techrover.co.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-secondary" />
                <span className="text-muted-foreground">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-secondary" />
                <span className="text-muted-foreground">Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Techrover. All rights reserved. | 
            <Link href="/privacy-policy" className="transition-colors hover:text-foreground"> Privacy Policy</Link> | 
            <Link href="/terms" className="transition-colors hover:text-foreground"> Terms of Service</Link>
          </p>
          <div className="mt-6 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}