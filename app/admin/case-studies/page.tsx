'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

interface CaseStudy {
  id: string
  title: string
  client: string
  industry: string
  country: string
  projectValue: string
  duration: string
  overview: string
}

export default function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<CaseStudy>>({})

  useEffect(() => {
    // Load case studies from JSON file
    import('@/data/case-studies.json').then(data => {
      setCaseStudies(data.default)
    })
  }, [])

  const handleSave = () => {
    // In a real app, this would save to database
    console.log('Saving case study:', formData)
    setIsEditing(false)
    setFormData({})
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Case Studies Management</h1>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Case Study
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Case Study</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={formData.client || ''}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="overview">Overview</Label>
              <Textarea
                id="overview"
                value={formData.overview || ''}
                onChange={(e) => setFormData({...formData, overview: e.target.value})}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Case Studies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {caseStudies.map((study) => (
              <div key={study.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{study.title}</h3>
                  <p className="text-sm text-gray-600">{study.client} • {study.industry}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.open(`/case-study/${study.id}`, '_blank')}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}