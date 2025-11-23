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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Meet Our Expert Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Talented professionals ready to bring your vision to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers?.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  
                  <div className="flex items-center justify-center mb-3">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">{member.rating} ({member.completedProjects} projects)</span>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {member.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 mb-4">{member.location}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">₹{member.hourlyRate}/hr</span>
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