'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Linkedin, Award, BookOpen, Briefcase, Star } from 'lucide-react'
import { useParams } from 'next/navigation'
import teamData from '@/data/team.json'

export default function TeamMemberPage() {
  const params = useParams()
  const member = teamData.find(m => m.id === params.id)

  if (!member) {
    return <div className="pt-16 text-center py-20">Team member not found</div>
  }

  return (
    <div className="pt-16">
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 mb-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Button>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{member.name.charAt(0)}</span>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{member.name}</h1>
              <p className="text-xl text-white/90 mb-4">{member.role}</p>
              <p className="text-white/80 max-w-2xl">{member.bio}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gradient-text">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Education & Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Education</h4>
                      <p className="text-gray-600">{member.education}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Experience</h4>
                      <p className="text-gray-600">{member.experience}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gradient-text">
                    <Award className="mr-2 h-5 w-5" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {member.certifications?.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <Star className="h-4 w-4 text-secondary mr-2" />
                        <span className="text-gray-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gradient-text">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Key Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {member.projects?.map((project, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{project}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="gradient-text">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {member.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="h-4 w-4 text-secondary mr-2" />
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="gradient-text">Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {member.specializations?.map((spec, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="text-center mt-12">
            <Button 
              variant="gradient" 
              size="lg"
              onClick={() => window.open(member.linkedin, '_blank')}
            >
              <Linkedin className="mr-2 h-5 w-5" />
              Connect on LinkedIn
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}