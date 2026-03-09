'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import teamData from '@/data/hire-team.json'

interface TeamMember {
  id: string
  name: string
  role: string
  skills: string[]
  rating: number
  completedProjects: number
  location: string
}

export function TeamPreview() {
  const teamMembers: TeamMember[] = teamData.teamMembers.slice(0, 3)

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-muted/50 dark:to-muted/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 gradient-text">
            Meet Our Expert Team
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Talented professionals ready to bring your vision to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {teamMembers?.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  
                  <div className="flex items-center justify-center mb-3">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-muted-foreground">{member.rating} ({member.completedProjects} projects)</span>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {member.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">{member.location}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <Link href="/team">
            <Button size="lg" variant="gradient">
              View Full Team
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}