import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'schedule.json')
    
    const fileContents = await fs.readFile(filePath, 'utf8')
    const scheduleData = JSON.parse(fileContents)
    
    const newBooking = {
      id: Date.now().toString(),
      ...data,
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    }
    
    scheduleData.bookedSlots = scheduleData.bookedSlots || []
    scheduleData.bookedSlots.push(newBooking)
    
    await fs.writeFile(filePath, JSON.stringify(scheduleData, null, 2))
    
    return NextResponse.json({ success: true, message: 'Meeting scheduled successfully' })
  } catch (error) {
    console.error('Error saving schedule:', error)
    return NextResponse.json(
      { error: 'Failed to schedule meeting' },
      { status: 500 }
    )
  }
}