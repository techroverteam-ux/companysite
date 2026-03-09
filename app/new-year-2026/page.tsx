import { NewYear2026Campaign } from '@/components/home/new-year-2026-campaign'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Calendar, Phone, Mail } from 'lucide-react'
import { Navbar } from '@/components/navbar/navbar'
import { Footer } from '@/components/footer/footer'
import Link from 'next/link'
import marketingData from '@/data/marketing.json'

export const metadata = {
  title: 'New Year 2026 Special Offers | TechRover - Future-Ready Solutions',
  description: 'Welcome 2026 with revolutionary technology solutions. Get exclusive discounts on AI-powered business suites, next-gen web experiences, and smart mobile ecosystems.',
  keywords: 'New Year 2026, AI solutions, quantum computing, future technology, special offers, TechRover',
}

export default function NewYear2026Page() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              NEW YEAR 2026
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
              🎊 Welcome to <span className="gradient-text">2026</span>
            </h1>
            <p className="mx-auto mt-5 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl">
              The Future of Technology Starts Now
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="#offers">
                <Button 
                  size="lg" 
                  variant="gradient"
                >
                  View Exclusive Offers
                </Button>
              </a>
              <a href="/contact?campaign=newyear2026">
                <Button 
                  size="lg" 
                  variant="outline"
                >
                  Get Free Consultation
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Campaign Section */}
      <div id="offers">
        <NewYear2026Campaign campaign={marketingData.newYear2026Campaign} />
      </div>

      {/* Why Choose TechRover for 2026 */}
      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              WHY US
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              Why Choose <span className="gradient-text">TechRover</span> for 2026?
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-[1.85] text-muted-foreground sm:text-lg">
              We're not just building for today – we're creating solutions for tomorrow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Future-Proof Technology",
                description: "Our solutions are designed to evolve with emerging technologies like quantum computing, neural interfaces, and advanced AI.",
                icon: "🚀"
              },
              {
                title: "Sustainable Innovation",
                description: "Carbon-neutral hosting, green computing practices, and eco-friendly development approaches for a better tomorrow.",
                icon: "🌱"
              },
              {
                title: "Global Expertise",
                description: "Our team combines international experience with cutting-edge research to deliver world-class solutions.",
                icon: "🌍"
              },
              {
                title: "24/7 AI Support",
                description: "Advanced AI-powered support systems ensure your business runs smoothly around the clock.",
                icon: "🤖"
              },
              {
                title: "Quantum Security",
                description: "Next-generation encryption and security protocols to protect your data in the quantum computing era.",
                icon: "🔐"
              },
              {
                title: "Metaverse Ready",
                description: "Prepare your business for virtual worlds with AR/VR integration and immersive digital experiences.",
                icon: "🥽"
              }
            ].map((feature, index) => (
              <Card key={feature.title} className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl mb-6">
            Ready to Transform Your Business in 2026?
          </h2>
          <p className="text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl mb-8">
            Don't miss out on these exclusive New Year offers. Limited time and slots available!
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card/80 border-border">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground">+91 9252891189</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 border-border">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground">hello@techrover.co.in</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 border-border">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold mb-2">Schedule</h3>
                <p className="text-muted-foreground">Free Consultation</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact?campaign=newyear2026">
              <Button 
                size="lg" 
                variant="gradient"
              >
                Claim Your 2026 Offer Now
              </Button>
            </a>
            <a href="/schedule">
              <Button 
                size="lg" 
                variant="outline"
              >
                Schedule Free Consultation
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}