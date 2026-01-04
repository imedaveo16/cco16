import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const centerId = searchParams.get('centerId')
    const unitType = searchParams.get('unitType')

    const units = await db.unit.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(centerId && { centerId }),
        ...(unitType && { unitType })
      },
      include: {
        operator: true,
        center: true
      },
      orderBy: {
        unitCode: 'asc'
      }
    })

    return NextResponse.json(units)
  } catch (error) {
    console.error('Error fetching units:', error)
    return NextResponse.json(
      { error: 'Failed to fetch units' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const unit = await db.unit.create({
      data: {
        unitCode: body.unitCode,
        unitType: body.unitType,
        callSign: body.callSign,
        status: body.status || 'OFFLINE',
        capacity: body.capacity,
        operatorId: body.operatorId,
        centerId: body.centerId
      },
      include: {
        operator: true,
        center: true
      }
    })

    return NextResponse.json(unit, { status: 201 })
  } catch (error) {
    console.error('Error creating unit:', error)
    return NextResponse.json(
      { error: 'Failed to create unit' },
      { status: 500 }
    )
  }
}
