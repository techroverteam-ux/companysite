import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { validateToken, decrypt } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const filePath = join(process.cwd(), 'data', `${params.type}.json`)
    const data = await readFile(filePath, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.split(' ')[1]
    if (!validateToken(token)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const body = await request.json()
    const decryptedData = decrypt(body.data)
    
    if (!decryptedData) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    
    const filePath = join(process.cwd(), 'data', `${params.type}.json`)
    await writeFile(filePath, JSON.stringify(decryptedData, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}