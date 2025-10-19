import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const filePath = join(process.cwd(), 'data', 'hire-team.json')
    const fileContent = await readFile(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    
    const newRequest = {
      id: `req-${Date.now()}`,
      ...body,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      assignedTeam: []
    }
    
    data.requests = data.requests || []
    data.requests.push(newRequest)
    
    await writeFile(filePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Request submitted successfully',
      requestId: newRequest.id 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit request' }, 
      { status: 500 }
    )
  }
}