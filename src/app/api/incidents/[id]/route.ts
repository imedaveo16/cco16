import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const incident = await db.incident.findUnique({
      where: { id: params.id },
      include: {
        center: true,
        operation: true,
        units: {
          include: {
            unit: true
          }
        },
        decision: {
          include: {
            user: true
          }
        },
        updates: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Error fetching incident:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const incident = await db.incident.update({
      where: { id: params.id },
      data: body,
      include: {
        center: true,
        operation: true
      }
    })

    // Create update log for status changes
    if (body.status) {
      await db.incidentUpdate.create({
        data: {
          incidentId: params.id,
          updateType: 'STATUS_CHANGE',
          description: `Status changed to ${body.status}`,
          updatedBy: body.updatedBy
        }
      })
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Error updating incident:', error)
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.incident.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting incident:', error)
    return NextResponse.json(
      { error: 'Failed to delete incident' },
      { status: 500 }
    )
  }
}
