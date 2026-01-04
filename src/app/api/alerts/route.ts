import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get('isActive')

    const alerts = await db.alert.findMany({
      where: {
        ...(isActive !== null && { isActive: isActive === 'true' })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const alert = await db.alert.create({
      data: {
        title: body.title,
        message: body.message,
        severity: body.severity,
        defcon: body.defcon || 'DEFCON_5',
        isRedMode: body.isRedMode || false,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
      }
    })

    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}
