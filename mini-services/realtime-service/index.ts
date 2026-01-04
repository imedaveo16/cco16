import { Server } from 'socket.io'

const PORT = 3002

const io = new Server(PORT, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

console.log(`DGPC Realtime Service running on port ${PORT}`)

// Store active connections and their metadata
const clients = new Map<string, {
  userId?: string
  role?: string
  centerId?: string
  isShadowMode?: boolean
  isDrillMode?: boolean
}>

// Store last known data for synchronization
let lastKnownData = {
  incidents: [],
  units: [],
  alerts: [],
  communications: [],
  defcon: 'DEFCON_5'
}

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  // Handle client initialization
  socket.on('init', (data) => {
    const clientData = {
      userId: data.userId,
      role: data.role,
      centerId: data.centerId,
      isShadowMode: data.isShadowMode || false,
      isDrillMode: data.isDrillMode || false
    }

    clients.set(socket.id, clientData)
    console.log(`Client ${socket.id} initialized:`, clientData)

    // Send current state to new client
    socket.emit('state-sync', lastKnownData)
  })

  // Handle client subscribing to specific channels
  socket.on('subscribe', (channels: string[]) => {
    channels.forEach(channel => {
      socket.join(channel)
      console.log(`Client ${socket.id} joined channel: ${channel}`)
    })
  })

  // Handle incident updates from backend
  socket.on('incident-update', (data) => {
    // Broadcast to all clients (or filter by center)
    const { incident, action } = data

    if (action === 'create') {
      lastKnownData.incidents.push(incident)
    } else if (action === 'update') {
      const index = lastKnownData.incidents.findIndex((i: any) => i.id === incident.id)
      if (index !== -1) {
        lastKnownData.incidents[index] = incident
      }
    } else if (action === 'delete') {
      lastKnownData.incidents = lastKnownData.incidents.filter((i: any) => i.id !== incident.id)
    }

    // Broadcast to all connected clients
    io.emit('incident-update', data)
    console.log(`Incident update broadcasted: ${action}`)
  })

  // Handle unit status updates
  socket.on('unit-update', (data) => {
    const { unit, action } = data

    if (action === 'create') {
      lastKnownData.units.push(unit)
    } else if (action === 'update') {
      const index = lastKnownData.units.findIndex((u: any) => u.id === unit.id)
      if (index !== -1) {
        lastKnownData.units[index] = unit
      }
    } else if (action === 'delete') {
      lastKnownData.units = lastKnownData.units.filter((u: any) => u.id !== unit.id)
    }

    io.emit('unit-update', data)
    console.log(`Unit update broadcasted: ${action}`)
  })

  // Handle alert updates
  socket.on('alert-update', (data) => {
    const { alert, action } = data

    if (action === 'create') {
      lastKnownData.alerts.push(alert)
    } else if (action === 'update') {
      const index = lastKnownData.alerts.findIndex((a: any) => a.id === alert.id)
      if (index !== -1) {
        lastKnownData.alerts[index] = alert
      }
    } else if (action === 'delete') {
      lastKnownData.alerts = lastKnownData.alerts.filter((a: any) => a.id !== alert.id)
    }

    io.emit('alert-update', data)
    console.log(`Alert update broadcasted: ${action}`)
  })

  // Handle DEFCON level changes
  socket.on('defcon-update', (data) => {
    lastKnownData.defcon = data.defcon
    io.emit('defcon-update', data)
    console.log(`DEFCON level updated to: ${data.defcon}`)
  })

  // Handle communication logs
  socket.on('communication', (data) => {
    lastKnownData.communications.push(data)
    io.emit('communication', data)
    console.log('Communication log broadcasted')
  })

  // Handle emergency broadcasts
  socket.on('emergency-broadcast', (data) => {
    io.emit('emergency-broadcast', data)
    console.log('Emergency broadcast sent')
  })

  // Handle RED MODE activation
  socket.on('red-mode', (data) => {
    io.emit('red-mode', data)
    console.log(`RED MODE ${data.active ? 'activated' : 'deactivated'}`)
  })

  // Handle drill mode
  socket.on('drill-mode', (data) => {
    io.emit('drill-mode', data)
    console.log(`Drill mode ${data.active ? 'activated' : 'deactivated'}`)
  })

  // Handle shadow mode
  socket.on('shadow-mode', (data) => {
    io.emit('shadow-mode', data)
    console.log(`Shadow mode ${data.active ? 'activated' : 'deactivated'}`)
  })

  // Handle replay mode
  socket.on('replay-start', (data) => {
    socket.join('replay')
    io.to('replay').emit('replay-start', data)
    console.log('Replay mode started')
  })

  socket.on('replay-stop', () => {
    socket.leave('replay')
    io.to('replay').emit('replay-stop')
    console.log('Replay mode stopped')
  })

  // Handle geofence breach alerts
  socket.on('geofence-alert', (data) => {
    io.emit('geofence-alert', data)
    console.log('Geofence alert sent')
  })

  // Handle unit telemetry
  socket.on('telemetry', (data) => {
    io.emit('telemetry', data)
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    clients.delete(socket.id)
    console.log(`Client disconnected: ${socket.id}`)
  })

  // Handle errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error)
  })
})

// Keep-alive mechanism
setInterval(() => {
  io.emit('ping', { timestamp: Date.now() })
}, 30000)

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  io.close()
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  io.close()
  process.exit(0)
})
