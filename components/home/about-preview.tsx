'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Target, Eye, Award, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface AboutData {
  story: {
    title: string
    content: string
  }
  mission: string
  vision: string
  values: Array<{
    title: string
    description: string
  }>
  team: Array<{
    name: string
    role: string
  }>
}

interface AboutPreviewProps {
  data: AboutData
}

export function AboutPreview({ data }: AboutPreviewProps) {
  const iconMap = {
    Innovation: Sparkles,
    Quality: Award,
    Transparency: Eye,
    'Global Mindset': Target,
  }

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
            WHO WE ARE
          </div>

          <h2 className="mx-auto max-w-4xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            About <span className="gradient-text">Techrover</span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.85] text-muted-foreground sm:text-lg">
            {data.story.content.substring(0, 150)}...
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Mission & Vision */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div
                      className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-4 transition-transform duration-300 group-hover:scale-110"
                    >
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold gradient-text">Our Mission</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{data.mission}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-secondary/5 to-transparent">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div
                      className="w-12 h-12 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center mr-4 transition-transform duration-300 group-hover:scale-110"
                    >
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold gradient-text">Our Vision</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{data.vision}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center lg:text-left">Our Core Values</h3>
            <div className="grid gap-4">
              {data.values.map((value, index) => {
                const Icon = iconMap[value.title as keyof typeof iconMap] || Award
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex items-start p-4 rounded-lg hover:bg-accent transition-all duration-300 group cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:shadow-lg transition-all duration-300"
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 group-hover:gradient-text transition-all duration-300">
                        {value.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Team Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="h-6 w-6 text-primary mr-2" />
            <h3 className="text-3xl font-bold gradient-text">Meet Our Expert Team</h3>
            <Sparkles className="h-6 w-6 text-secondary ml-2" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {data.team.slice(0, 4).map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="border-0 shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-muted/50">
                  <CardContent className="p-6 text-center">
                    <div
                      className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500"
                    >
                      <span className="text-2xl font-bold text-white">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h4 className="font-bold text-lg mb-1 group-hover:gradient-text transition-all duration-300">
                      {member.name}
                    </h4>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                      {member.role}
                    </p>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                      className="h-0.5 bg-gradient-to-r from-primary to-secondary mt-3 mx-auto"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/team">
              <Button size="lg" variant="gradient" className="group">
                <Users className="mr-2 h-5 w-5" />
                Meet Full Team
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="group">
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}