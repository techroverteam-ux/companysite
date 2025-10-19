import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'collaboration.json')
    
    const fileContents = await fs.readFile(filePath, 'utf8')
    const collabData = JSON.parse(fileContents)
    
    const newProposal = {
      id: Date.now().toString(),
      ...data,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
    
    collabData.proposals = collabData.proposals || []
    collabData.proposals.push(newProposal)
    
    await fs.writeFile(filePath, JSON.stringify(collabData, null, 2))
    
    return NextResponse.json({ success: true, message: 'Collaboration proposal submitted successfully' })
  } catch (error) {
    console.error('Error saving collaboration:', error)
    return NextResponse.json(
      { error: 'Failed to submit proposal' },
      { status: 500 }
    )
  }
}