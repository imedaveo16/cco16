'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, Activity, Map, Radio, Phone, Navigation, AlertCircle, Zap, Settings, Maximize, Minimize } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXTREME'
type Status = 'OPEN' | 'ACTIVE' | 'MONITORING' | 'CLOSED' | 'ARCHIVED'
type UnitStatus = 'ON_DUTY' | 'ENGAGED' | 'MAINTENANCE' | 'OFFLINE'

interface Incident {
  id: string
  incidentId: string
  title: string
  description: string
  severity: Severity
  status: Status
  latitude: number
  longitude: number
  address: string
  source: string
  createdAt: string
}

interface Unit {
  id: string
  unitCode: string
  unitType: string
  callSign: string
  status: UnitStatus
  latitude?: number
  longitude?: number
  capacity: number
}

interface Communication {
  id: string
  channel: string
  message: string
  timestamp: string
  sender?: string
}

export default function OperatorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRedMode, setIsRedMode] = useState(false)
  const [isPanelMinimized, setIsPanelMinimized] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // تحقق من تسجيل الدخول
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const email = localStorage.getItem('userEmail')
    const role = localStorage.getItem('userRole')

    if (!isLoggedIn || !email) {
      window.location.href = '/auth/login'
      return
    }

    if (role !== 'OPERATOR') {
      // إعادة توجيه للوحة التحكم المناسبة
      window.location.href = `/dashboard/${role.toLowerCase()}`
      return
    }

    setUserEmail(email || '')

    // تحديث الساعة
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/auth/login'
  }

  const getSeverityColor = (severity: Severity): string => {
    const colors = {
      LOW: 'bg-green-500',
      MEDIUM: 'bg-yellow-500',
      HIGH: 'bg-orange-500',
      CRITICAL: 'bg-red-600',
      EXTREME: 'bg-red-700'
    }
    return colors[severity]
  }

  const getUnitStatusColor = (status: UnitStatus): string => {
    const colors = {
      ON_DUTY: 'bg-green-500',
      ENGAGED: 'bg-red-500',
      MAINTENANCE: 'bg-yellow-500',
      OFFLINE: 'bg-gray-500'
    }
    return colors[status]
  }

  // بيانات تجريبية
  const incidents: Incident[] = [
    {
      id: '1',
      incidentId: 'INC-2024-001',
      title: 'حريق في مبنى سكني',
      description: 'تقارير متعددة عن حريق في مبنى سكني مكون من 5 طوابق',
      severity: 'CRITICAL',
      status: 'ACTIVE',
      latitude: 36.7538,
      longitude: 3.0588,
      address: 'الجزائر المركزية، شارع ديدوش مراد',
      source: 'تطبيق المواطن',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      incidentId: 'INC-2024-002',
      title: 'حادث مروري على الطريق السريع',
      description: 'تصادم متعدد المركبات على الطريق السريع شرق-غرب',
      severity: 'HIGH',
      status: 'ACTIVE',
      latitude: 36.7200,
      longitude: 3.1500,
      address: 'الطريق السريع N1، مخرج 45',
      source: 'تطبيق السائق',
      createdAt: new Date(Date.now() - 1800000).toISOString()
    }
  ]

  const units: Unit[] = [
    {
      id: '1',
      unitCode: 'ISN-001',
      unitType: 'إسعاف',
      callSign: 'إسعاف-ألفا',
      status: 'ENGAGED',
      capacity: 4,
      latitude: 36.7538,
      longitude: 3.0588
    },
    {
      id: '2',
      unitCode: 'ATF-002',
      unitType: 'شاحنة إطفاء',
      callSign: 'إطفاء-برافو',
      status: 'ENGAGED',
      capacity: 6,
      latitude: 36.7550,
      longitude: 3.0570
    },
    {
      id: '3',
      unitCode: 'RESC-003',
      unitType: 'فريق إنقاذ',
      callSign: 'إنقاذ-تشارلي',
      status: 'ON_DUTY',
      capacity: 8
    }
  ]

  const communications: Communication[] = [
    { id: '1', channel: 'لاسلكي', message: 'إسعاف-ألفا: في الطريق إلى الحادث INC-2024-001', timestamp: new Date().toISOString(), sender: 'إسعاف-ألفا' },
    { id: '2', channel: 'لاسلكي', message: 'إطفاء-برافو: وصلنا إلى الموقع، نبدأ العمليات', timestamp: new Date(Date.now() - 300000).toISOString(), sender: 'إطفاء-برافو' },
    { id: '3', channel: 'هاتف', message: 'مركز القيادة: مطلوب تحديث بشأن عدد الضحايا', timestamp: new Date(Date.now() - 600000).toISOString(), sender: 'مركز القيادة' }
  ]

  return (
    <div className={`min-h-screen flex flex-col bg-background ${isRedMode ? 'emergency-flash' : ''}`}>
      {/* تأثير RED MODE */}
      {isRedMode && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-destructive/10 emergency-flash"></div>
      )}

      {/* الترويسة NASA Style */}
      <header className="border-b border-foreground/20 bg-card tech-corners">
        <div className="p-2">
          <div className="flex items-center justify-between gap-4">
            {/* اليمين: علم الجزائر + الشعار */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* علم الجزائر (تحريك خفيف) */}
                <div className="relative w-12 h-8">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full bg-green-500"></div>
                    <div className="w-1/2 h-full bg-white"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-white"></div>
                  </div>
                </div>
                {/* شعار الجمهورية */}
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center glow-effect">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* النص العريض في المنتصف */}
              <div className="text-right border-r border-foreground/20 pr-4">
                <p className="text-sm font-bold text-foreground tracking-wide">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                <p className="text-xs text-primary font-semibold tracking-wide">وزارة الداخلية والجماعات المحلية</p>
                <p className="text-xs text-muted-foreground">المديرية العامة للحماية المدنية</p>
              </div>
            </div>

            {/* اليسار: الساعة + زر الطوارئ */}
            <div className="flex items-center gap-6">
              {/* الساعة الرقمية */}
              <div className="text-left">
                <div className="flex items-baseline gap-2">
                  <div className="mono-font text-2xl font-bold text-primary text-glow">
                    {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div>UTC {currentTime.getUTCHours()}:{String(currentTime.getUTCMinutes()).padStart(2, '0')}</div>
                    <div>ALG {currentTime.toLocaleTimeString('en-US', { timeZone: 'Africa/Algiers', hour12: false })}</div>
                  </div>
                </div>
              </div>

              <div className="w-px h-8 bg-foreground/20"></div>

              {/* زر الطوارئ Panic Button */}
              <Button
                onClick={() => setIsRedMode(!isRedMode)}
                className={`nasa-button ${isRedMode ? 'bg-destructive nasa-alert-flash' : 'bg-destructive/80'} hover:bg-destructive px-6 py-3 font-bold text-white`}
              >
                <Zap className="w-5 h-5 mr-2" />
                طوارئ
              </Button>

              {/* زر الإعدادات */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-foreground/20 hover:bg-foreground/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* شريط DEFCON والتنبيهات */}
        <div className="px-2 pb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-nasa-label text-muted-foreground">حالة الاستعداد:</span>
              <Badge className="bg-green-500 text-white font-bold text-sm px-3 py-1 glow-effect">DEFCON 5</Badge>
            </div>
            <div className="h-6 w-px bg-foreground/20"></div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive nasa-blink" />
              <span className="text-sm text-destructive font-bold">{incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'EXTREME').length} تنبيهات حرجة</span>
            </div>
            <div className="h-6 w-px bg-foreground/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-nasa-label text-muted-foreground">حوادث نشطة:</span>
              <Badge variant="outline" className="border-foreground/30 text-foreground">{incidents.length}</Badge>
            </div>
            <div className="flex-1"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPanelMinimized(!isPanelMinimized)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isPanelMinimized ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* منطقة المحتوى الرئيسية */}
      <div className="flex-1 flex overflow-hidden">
        {/* اللوحة اليسرى - قائمة الحوادث */}
        <aside className={`transition-all duration-300 ${isPanelMinimized ? 'w-16' : 'w-96'} border-l border-foreground/20 bg-card`}>
          {!isPanelMinimized && (
            <>
              <div className="p-3 border-b border-foreground/10">
                <h2 className="text-nasa-header flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  الحوادث
                </h2>
              </div>
              <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
                <div className="p-3 space-y-3">
                  {incidents.map((incident) => (
                    <Card key={incident.id} className={`card-nasa card-nasa-hover p-4 tech-corners ${incident.status === 'ACTIVE' ? 'glow-border nasa-pulse' : ''}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge className={`${getSeverityColor(incident.severity)} text-white text-xs font-bold px-2 py-1`}>
                          {incident.severity === 'LOW' && 'منخفض'}
                          {incident.severity === 'MEDIUM' && 'متوسط'}
                          {incident.severity === 'HIGH' && 'عالي'}
                          {incident.severity === 'CRITICAL' && 'حرج'}
                          {incident.severity === 'EXTREME' && 'شديد الخطورة'}
                        </Badge>
                        <Badge className="bg-primary text-white text-xs font-bold px-2 py-1">
                          {incident.status === 'OPEN' && 'مفتوح'}
                          {incident.status === 'ACTIVE' && 'نشط'}
                          {incident.status === 'MONITORING' && 'مراقبة'}
                          {incident.status === 'CLOSED' && 'مغلق'}
                          {incident.status === 'ARCHIVED' && 'مؤرشف'}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-1 text-foreground">{incident.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{incident.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="border-foreground/30 text-foreground text-xs">
                          {incident.incidentId}
                        </Badge>
                        <span>•</span>
                        <span>{incident.source}</span>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {incident.address}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </aside>

        {/* اللوحة المركزية - الخريطة */}
        <main className="flex-1 flex flex-col bg-background relative">
          <div className="p-3 border-b border-foreground/10 bg-card/50">
            <h2 className="text-nasa-header flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              الخريطة التشغيلية
            </h2>
          </div>

          {/* خريطة مؤقتة - سيتم استبدالها بـ Mapbox */}
          <div className="flex-1 relative overflow-hidden grid-overlay">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Map className="w-24 h-24 mx-auto text-primary/50 glow-effect" />
                <h3 className="text-2xl font-bold text-foreground">الخريطة التفاعلية</h3>
                <p className="text-muted-foreground">جاري تحميل الخريطة...</p>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="text-center">
                    <div className="w-4 h-4 rounded-full bg-red-600 mx-auto mb-2 nasa-pulse"></div>
                    <span className="text-xs text-muted-foreground">حرج/شديد</span>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-2"></div>
                    <span className="text-xs text-muted-foreground">نشط</span>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 mx-auto mb-2"></div>
                    <span className="text-xs text-muted-foreground">في الخدمة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* اللوحة اليمنى - حالة الوحدات */}
        <aside className={`transition-all duration-300 ${isPanelMinimized ? 'w-16' : 'w-96'} border-r border-foreground/20 bg-card`}>
          {!isPanelMinimized && (
            <>
              <div className="p-3 border-b border-foreground/10">
                <h2 className="text-nasa-header flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  حالة الوحدات
                </h2>
              </div>
              <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
                <div className="p-3 space-y-3">
                  {units.map((unit) => (
                    <Card key={unit.id} className={`card-nasa card-nasa-hover p-4 tech-corners`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getUnitStatusColor(unit.status)} text-white text-xs font-bold px-2 py-1`}>
                            {unit.status === 'ON_DUTY' && 'في الخدمة'}
                            {unit.status === 'ENGAGED' && 'مشغول'}
                            {unit.status === 'MAINTENANCE' && 'صيانة'}
                            {unit.status === 'OFFLINE' && 'غير متصل'}
                          </Badge>
                          <Badge variant="outline" className="border-foreground/30 text-foreground text-xs">
                            {unit.unitCode}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{unit.capacity} أشخاص</span>
                      </div>
                      <h3 className="font-semibold text-sm mb-1 text-foreground">{unit.callSign}</h3>
                      <div className="text-xs text-muted-foreground mb-2">{unit.unitType}</div>
                      {unit.latitude && unit.longitude && (
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {unit.latitude.toFixed(4)}, {unit.longitude.toFixed(4)}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </aside>
      </div>

      {/* الشريط السفلي - سجل التواصل */}
      <footer className="border-t border-foreground/20 bg-card tech-corners">
        <div className="p-2">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-nasa-header flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary" />
              سجل التواصل
            </h2>
            <div className="flex-1"></div>
            <Badge variant="outline" className="border-foreground/30 text-foreground text-xs">{communications.length} رسائل</Badge>
          </div>
          <div className="h-32 overflow-y-auto bg-background/50 rounded border border-foreground/10 p-3">
            <div className="space-y-2">
              {communications.map((comm) => (
                <div key={comm.id} className="flex items-start gap-3 text-sm">
                  <Badge variant="outline" className="border-foreground/30 text-foreground text-xs min-w-fit">
                    {comm.channel === 'لاسلكي' && <Radio className="w-3 h-3 inline" />}
                    {comm.channel === 'هاتف' && <Phone className="w-3 h-3 inline" />}
                    {comm.channel}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-foreground mb-1">{comm.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {comm.sender && <span className="text-primary font-semibold">{comm.sender} • </span>}
                      {new Date(comm.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// تصدير MapPin للاستخدام
function MapPin({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 9-9c0 2.23-5.07-3-9-3z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
