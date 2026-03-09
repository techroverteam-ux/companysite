'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Star } from 'lucide-react'
import teamData from '@/data/hire-team.json'

interface TeamMember {
  id: string
  name: string
  role: string
  skills: string[]
  rating: number
  completedProjects: number
  location: string
  hourlyRate: number
  availability: string
}

export default function TeamPage() {
  const teamMembers: TeamMember[] = teamData.teamMembers

  return (
    <section className="pt-28 sm:pt-32 pb-14 sm:pb-16 bg-muted/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl mb-6 gradient-text">
            Meet Our Expert Team
          </h1>
          <p className="text-base leading-[1.85] text-muted-foreground sm:text-lg md:text-xl max-w-3xl mx-auto">
            Talented professionals ready to bring your vision to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers?.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
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

                  <p className="text-sm text-muted-foreground mb-4">{member.location}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">₹{member.hourlyRate}/hr</span>
                    <Badge variant={member.availability === 'available' ? 'default' : 'destructive'}>
                      {member.availability}
                    </Badge>
                  </div>

                  <Button className="w-full" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}