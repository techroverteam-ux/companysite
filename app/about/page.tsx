'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Linkedin, MapPin, Users, Award } from 'lucide-react'
import aboutData from '@/data/about.json'

export default function AboutPage() {
  return (
    <div className="pt-16">
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Techrover</h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto text-white/90">
              {aboutData.story.content}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl gradient-text">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{aboutData.mission}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl gradient-text">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{aboutData.vision}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutData.team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-secondary font-medium mb-2">{member.role}</p>
                      <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
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
            <h2 className="text-3xl font-bold mb-8">Our Achievements</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
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