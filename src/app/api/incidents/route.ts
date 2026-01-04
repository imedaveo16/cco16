import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')
    const centerId = searchParams.get('centerId')
    const isDrill = searchParams.get('isDrill')

    const incidents = await db.incident.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(severity && { severity: severity as any }),
        ...(centerId && { centerId }),
        ...(isDrill !== null && { isDrill: isDrill === 'true' })
      },
      include: {
        center: true,
        operation: true,
        units: {
          include: {
            unit: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(incidents)
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate incident ID
    const incidentId = `INC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

    const incident = await db.incident.create({
      data: {
        incidentId,
        title: body.title,
        description: body.description,
        severity: body.severity,
        status: body.status || 'OPEN',
        latitude: body.latitude,
        longitude: body.longitude,
        address: body.address,
        source: body.source,
        reportById: body.reportById,
        centerId: body.centerId,
        isDrill: body.isDrill || false
      },
      include: {
        center: true,
        operation: true
      }
    })

    // Create initial update log
    await db.incidentUpdate.create({
      data: {
        incidentId: incident.id,
        updateType: 'INCIDENT_CREATED',
        description: `Incident ${incidentId} created with severity ${body.severity}`,
        updatedBy: body.createdBy
      }
    })

    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    console.error('Error creating incident:', error)
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    )
  }
}
