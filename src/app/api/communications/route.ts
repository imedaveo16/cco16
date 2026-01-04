import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const isDrill = searchParams.get('isDrill')

    const communications = await db.communicationLog.findMany({
      where: {
        ...(isDrill !== null && { isDrill: isDrill === 'true' })
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json(communications)
  } catch (error) {
    console.error('Error fetching communications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch communications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const communication = await db.communicationLog.create({
      data: {
        fromUserId: body.fromUserId,
        toUserId: body.toUserId,
        channel: body.channel,
        message: body.message,
        isDrill: body.isDrill || false
      }
    })

    return NextResponse.json(communication, { status: 201 })
  } catch (error) {
    console.error('Error creating communication:', error)
    return NextResponse.json(
      { error: 'Failed to create communication' },
      { status: 500 }
    )
  }
}
