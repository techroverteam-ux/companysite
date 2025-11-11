import { NewYear2026Campaign } from '@/components/home/new-year-2026-campaign'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Calendar, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import marketingData from '@/data/marketing.json'

export const metadata = {
  title: 'New Year 2026 Special Offers | TechRover - Future-Ready Solutions',
  description: 'Welcome 2026 with revolutionary technology solutions. Get exclusive discounts on AI-powered business suites, next-gen web experiences, and smart mobile ecosystems.',
  keywords: 'New Year 2026, AI solutions, quantum computing, future technology, special offers, TechRover',
}

export default function NewYear2026Page() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🎊 Welcome to <span className="text-yellow-400">2026</span>
            </h1>
            <p className="text-2xl mb-8 text-gray-200">
              The Future of Technology Starts Now
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#offers">
                <Button 
                  size="lg" 
                  className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold px-8 py-4"
                >
                  View Exclusive Offers
                </Button>
              </a>
              <a href="/contact?campaign=newyear2026">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-900 font-bold px-8 py-4"
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">TechRover</span> for 2026?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business in 2026?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Don't miss out on these exclusive New Year offers. Limited time and slots available!
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-blue-100">+91 9876543210</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-blue-100">hello@techrover.co.in</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-semibold mb-2">Schedule</h3>
                <p className="text-blue-100">Free Consultation</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact?campaign=newyear2026">
              <Button 
                size="lg" 
                className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold px-8 py-4"
              >
                Claim Your 2026 Offer Now
              </Button>
            </a>
            <a href="/schedule">
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600 font-bold px-8 py-4"
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
  )
}