'use client'

import { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon issue in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXTREME'
type UnitStatus = 'ON_DUTY' | 'ENGAGED' | 'MAINTENANCE' | 'OFFLINE'

interface Incident {
  id: string
  incidentId: string
  title: string
  severity: IncidentSeverity
  status: string
  latitude: number
  longitude: number
  address: string
}

interface Unit {
  id: string
  unitCode: string
  callSign: string
  status: UnitStatus
  latitude?: number
  longitude?: number
}

interface InteractiveMapProps {
  incidents: Incident[]
  units: Unit[]
  onIncidentClick?: (incident: Incident) => void
  onUnitClick?: (unit: Unit) => void
  isRedMode?: boolean
}

export function InteractiveMap({
  incidents,
  units,
  onIncidentClick,
  onUnitClick,
  isRedMode = false
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Center on Algiers, Algeria
    const map = L.map(mapRef.current).setView([36.7538, 3.0588], 12)

    // Add OpenStreetMap tiles (professional, no API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map
    setIsLoaded(true)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update incidents on map
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    // Remove existing incident markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker && (layer.options as any).isIncident) {
        mapInstanceRef.current?.removeLayer(layer)
      }
    })

    // Add incident markers
    incidents.forEach((incident) => {
      const color = getSeverityColor(incident.severity)
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            ${incident.status === 'ACTIVE' ? 'animation: pulse 1.5s infinite;' : ''}
          ">
            ${getSeverityIcon(incident.severity)}
          </div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.2); opacity: 0.8; }
            }
          </style>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([incident.latitude, incident.longitude], {
        icon,
        isIncident: true,
      } as any).addTo(mapInstanceRef.current)

      // Add popup
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${incident.incidentId}</h3>
          <p style="margin: 4px 0;">${incident.title}</p>
          <p style="margin: 4px 0; color: ${color}; font-weight: bold;">${incident.severity}</p>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">${incident.address}</p>
        </div>
      `)

      // Click handler
      marker.on('click', () => {
        onIncidentClick?.(incident)
      })
    })

    // Fit map to show all incidents if there are any
    if (incidents.length > 0) {
      const bounds = L.latLngBounds(
        incidents.map((inc) => [inc.latitude, inc.longitude] as [number, number])
      )
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [incidents, isLoaded, onIncidentClick])

  // Update units on map
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    // Remove existing unit markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker && (layer.options as any).isUnit) {
        mapInstanceRef.current?.removeLayer(layer)
      }
    })

    // Add unit markers
    units.forEach((unit) => {
      if (!unit.latitude || !unit.longitude) return

      const color = getUnitStatusColor(unit.status)
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 10px;
          ">
            U
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const marker = L.marker([unit.latitude, unit.longitude], {
        icon,
        isUnit: true,
      } as any).addTo(mapInstanceRef.current)

      // Add popup
      marker.bindPopup(`
        <div style="min-width: 180px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${unit.callSign}</h3>
          <p style="margin: 4px 0;">${unit.unitCode}</p>
          <p style="margin: 4px 0; color: ${color}; font-weight: bold;">${unit.status.replace('_', ' ')}</p>
        </div>
      `)

      // Click handler
      marker.on('click', () => {
        onUnitClick?.(unit)
      })
    })
  }, [units, isLoaded, onUnitClick])

  const getSeverityColor = (severity: IncidentSeverity): string => {
    const colors = {
      LOW: '#22c55e',
      MEDIUM: '#eab308',
      HIGH: '#f97316',
      CRITICAL: '#dc2626',
      EXTREME: '#991b1b',
    }
    return colors[severity]
  }

  const getSeverityIcon = (severity: IncidentSeverity): string => {
    const icons = {
      LOW: '!',
      MEDIUM: '⚠',
      HIGH: '⚠',
      CRITICAL: '!!',
      EXTREME: '⚡',
    }
    return icons[severity]
  }

  const getUnitStatusColor = (status: UnitStatus): string => {
    const colors = {
      ON_DUTY: '#22c55e',
      ENGAGED: '#dc2626',
      MAINTENANCE: '#eab308',
      OFFLINE: '#6b7280',
    }
    return colors[status]
  }

  return (
    <div
      ref={mapRef}
      className={`w-full h-full ${isRedMode ? 'border-2 border-red-500' : ''}`}
      style={{ minHeight: '400px' }}
    />
  )
}
