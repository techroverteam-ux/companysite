'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Linkedin, MapPin, Users, Award } from 'lucide-react'
import aboutData from '@/data/about.json'

export default function AboutPage() {
  return (
    <div className="pt-16">
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              WHO WE ARE
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
              About <span className="gradient-text">Techrover</span>
            </h1>
            <p className="mx-auto mt-5 max-w-4xl text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl">
              {aboutData.story.content}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl gradient-text">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{aboutData.mission}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl gradient-text">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{aboutData.vision}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-10 sm:mb-12">
            <div className="text-center mb-10 sm:mb-12">
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
                OUR TEAM
              </div>
              <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Our <span className="gradient-text">Team</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {aboutData.team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-secondary font-medium mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => alert('Team profile coming soon!')}
                        >
                          View Profile
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(member.linkedin, '_blank')}
                        >
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs tracking-[0.12em] text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              ACHIEVEMENTS
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl mb-8">Our <span className="gradient-text">Achievements</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {aboutData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <Award className="h-6 w-6 text-secondary mr-3" />
                  <span className="font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}