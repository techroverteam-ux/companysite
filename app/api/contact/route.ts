import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'contact.json')
    
    const fileContents = await fs.readFile(filePath, 'utf8')
    const contactData = JSON.parse(fileContents)
    
    const newInquiry = {
      id: Date.now().toString(),
      ...data,
      timestamp: new Date().toISOString(),
      status: 'new'
    }
    
    contactData.inquiries = contactData.inquiries || []
    contactData.inquiries.push(newInquiry)
    
    await fs.writeFile(filePath, JSON.stringify(contactData, null, 2))
    
    return NextResponse.json({ success: true, message: 'Contact form submitted successfully' })
  } catch (error) {
    console.error('Error saving contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}