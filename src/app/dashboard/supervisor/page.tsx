'use client'

import { useState, useEffect } from 'react'
import { Shield, Activity, Map, TrendingUp, Users, AlertTriangle, LayoutGrid, BarChart3, ArrowRight, Maximize, Minimize } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXTREME'
type UnitStatus = 'ON_DUTY' | 'ENGAGED' | 'MAINTENANCE' | 'OFFLINE'

interface Incident {
  id: string
  incidentId: string
  title: string
  description: string
  severity: Severity
  status: string
  region: string
  center: string
  createdAt: string
}

interface ResourceStats {
  totalUnits: number
  activeUnits: number
  availableUnits: number
  inMaintenance: number
  incidentsTotal: number
  incidentsActive: number
  incidentsResolved: number
  responseTimeAvg: string
}

export default function SupervisorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPanelMinimized, setIsPanelMinimized] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('جميع المناطق')
  const [isRedMode, setIsRedMode] = useState(false)

  useEffect(() => {
    // تحقق من الدور
    const role = localStorage.getItem('userRole')
    if (role !== 'SUPERVISOR') {
      window.location.href = '/auth/login'
      return
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // إحصائيات تجريبية
  const stats: ResourceStats = {
    totalUnits: 24,
    activeUnits: 8,
    availableUnits: 12,
    inMaintenance: 4,
    incidentsTotal: 45,
    incidentsActive: 7,
    incidentsResolved: 38,
    responseTimeAvg: '8.2 دقيقة'
  }

  const incidents: Incident[] = [
    {
      id: '1',
      incidentId: 'INC-2024-001',
      title: 'حريق في مبنى سكني',
      description: 'تقارير متعددة عن حريق في مبنى سكني مكون من 5 طوابق',
      severity: 'CRITICAL',
      status: 'ACTIVE',
      region: 'الجزائر المركزية',
      center: 'مركز 01',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      incidentId: 'INC-2024-002',
      title: 'حادث مروري على الطريق السريع',
      description: 'تصادم متعدد المركبات على الطريق السريع شرق-غرب',
      severity: 'HIGH',
      status: 'ACTIVE',
      region: 'البليدة',
      center: 'مركز 02',
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: '3',
      incidentId: 'INC-2024-003',
      title: 'تحذير من الفيضانات',
      description: 'أمطار غزيرة تسبب فيضانات محلية',
      severity: 'MEDIUM',
      status: 'MONITORING',
      region: 'سطيف',
      center: 'مركز 03',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ]

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* الترويسة المشتركة */}
      <header className="border-b border-foreground/20 bg-card tech-corners">
        <div className="p-2">
          <div className="flex items-center justify-between gap-4">
            {/* الشريط العلوي المشترك */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* علم الجزائر */}
                <div className="relative w-10 h-6">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full bg-green-500"></div>
                    <div className="w-1/2 h-full bg-white"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white"></div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center glow-effect">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="text-right border-r border-foreground/20 pr-4">
                <p className="text-xs font-bold text-foreground tracking-wide">المشرف الإقليمي</p>
                <p className="text-xs text-primary font-semibold">لوحة إشراف شاملة</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* الساعة */}
              <div className="text-left">
                <div className="mono-font text-lg font-bold text-primary text-glow">
                  {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                </div>
                <div className="text-xs text-muted-foreground">
                  UTC | ALG {currentTime.toLocaleTimeString('en-US', { timeZone: 'Africa/Algiers', hour12: false })}
                </div>
              </div>

              <div className="w-px h-8 bg-foreground/20"></div>

              {/* أزرار التحكم */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <ArrowRight className="w-4 h-4" />
                  خروج
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsPanelMinimized(!isPanelMinimized)}>
                  {isPanelMinimized ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex overflow-hidden">
        {/* اللوحة اليسرى - إحصائيات شاملة */}
        <aside className={`transition-all duration-300 ${isPanelMinimized ? 'w-0' : 'w-96'} border-l border-foreground/20 bg-card`}>
          {!isPanelMinimized && (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                <h2 className="text-nasa-header text-foreground mb-4">
                  <TrendingUp className="w-5 h-5 inline mr-2 text-primary" />
                  إحصائيات الإقليم
                </h2>

                {/* بطاقات الإحصائيات */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="card-nasa card-nasa-hover p-4 tech-corners">
                    <div className="text-xs text-nasa-label text-muted-foreground mb-2">إجمالي الوحدات</div>
                    <div className="text-2xl font-bold text-foreground text-glow">{stats.totalUnits}</div>
                  </Card>
                  <Card className="card-nasa card-nasa-hover p-4 tech-corners">
                    <div className="text-xs text-nasa-label text-muted-foreground mb-2">وحدات نشطة</div>
                    <div className="text-2xl font-bold text-status-engaged nasa-pulse">{stats.activeUnits}</div>
                  </Card>
                  <Card className="card-nasa card-nasa-hover p-4 tech-corners">
                    <div className="text-xs text-nasa-label text-muted-foreground mb-2">متاحة للخدمة</div>
                    <div className="text-2xl font-bold text-status-active text-glow">{stats.availableUnits}</div>
                  </Card>
                  <Card className="card-nasa card-nasa-hover p-4 tech-corners">
                    <div className="text-xs text-nasa-label text-muted-foreground mb-2">في الصيانة</div>
                    <div className="text-2xl font-bold text-yellow-500">{stats.inMaintenance}</div>
                  </Card>
                  <Card className="card-nasa card-nasa-hover p-4 tech-corners">
                    <div className="text-xs text-nasa-label text-muted-foreground mb-2">حوادث نشطة</div>
                    <div className="text-2xl font-bold text-destructive nasa-pulse">{stats.incidentsActive}</div>
                  </Card>
                  <Card className="card-nasa card-nasa-hover p-4 tech-corners">
                    <div className="text-xs text-nasa-label text-muted-foreground mb-2">محلولة</div>
                    <div className="text-2xl font-bold text-status-active text-glow">{stats.incidentsResolved}</div>
                  </Card>
                </div>

                {/* متوسط وقت الاستجابة */}
                <Card className="card-nasa p-4 tech-corners">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-xs text-nasa-label text-muted-foreground">متوسط وقت الاستجابة</div>
                      <div className="text-3xl font-bold text-primary text-glow mt-1">{stats.responseTimeAvg}</div>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center glow-effect">
                      <BarChart3 className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/50">ممتاز</Badge>
                    <span>أقل من المستهدف (10 دقائق)</span>
                  </div>
                </Card>

                {/* المناطق والمراكز */}
                <div className="space-y-3">
                  <h3 className="text-nasa-label text-foreground">المناطق والمراكز</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Card className="card-nasa-hover p-3 tech-corners cursor-pointer">
                      <div className="text-sm font-semibold text-foreground">الجزائر المركزية</div>
                      <div className="text-xs text-muted-foreground mt-1">3 مراكز • 8 وحدات</div>
                    </Card>
                    <Card className="card-nasa-hover p-3 tech-corners cursor-pointer">
                      <div className="text-sm font-semibold text-foreground">البليدة</div>
                      <div className="text-xs text-muted-foreground mt-1">2 مركز • 6 وحدات</div>
                    </Card>
                    <Card className="card-nasa-hover p-3 tech-corners cursor-pointer">
                      <div className="text-sm font-semibold text-foreground">سطيف</div>
                      <div className="text-xs text-muted-foreground mt-1">2 مركز • 5 وحدات</div>
                    </Card>
                    <Card className="card-nasa-hover p-3 tech-corners cursor-pointer">
                      <div className="text-sm font-semibold text-foreground">تيزي وزو</div>
                      <div className="text-xs text-muted-foreground mt-1">1 مركز • 3 وحدات</div>
                    </Card>
                  </div>
                </div>

                {/* أزرار سريعة */}
                <div className="space-y-3">
                  <h3 className="text-nasa-label text-foreground">العمليات السريعة</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="nasa-button bg-primary hover:bg-primary/90 text-primary-foreground tech-corners" variant="default">
                      <Users className="w-4 h-4 mr-2" />
                      توزيع الموارد
                    </Button>
                    <Button className="nasa-button bg-destructive/80 hover:bg-destructive text-white tech-corners" variant="default">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      تنبيه عام
                    </Button>
                    <Button className="nasa-button bg-card border border-foreground/20 hover:bg-foreground/10 text-foreground tech-corners" variant="default">
                      <Map className="w-4 h-4 mr-2" />
                      عرض الخريطة
                    </Button>
                    <Button className="nasa-button bg-card border border-foreground/20 hover:bg-foreground/10 text-foreground tech-corners" variant="default">
                      <Activity className="w-4 h-4 mr-2" />
                      سجل العمليات
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </aside>

        {/* اللوحة المركزية - عرض شامل للولاية */}
        <main className="flex-1 flex flex-col bg-background">
          <div className="p-3 border-b border-foreground/10 bg-card/50">
            <div className="flex items-center justify-between">
              <h2 className="text-nasa-header text-foreground flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-primary" />
                عرض إشراف شامل للولاية
              </h2>
              <div className="flex items-center gap-4">
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-background border-foreground/20 text-foreground px-3 py-2 rounded"
                >
                  <option>جميع المناطق</option>
                  <option>الجزائر المركزية</option>
                  <option>البليدة</option>
                  <option>سطيف</option>
                  <option>تيزي وزو</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incidents.map((incident) => (
                <Card key={incident.id} className={`card-nasa card-nasa-hover p-4 tech-corners ${incident.status === 'ACTIVE' ? 'glow-border nasa-pulse' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge className="bg-primary text-white text-xs font-bold px-2 py-1">
                      {incident.incidentId}
                    </Badge>
                    <Badge className={`${
                      incident.severity === 'LOW' && 'bg-green-500'
                    } ${incident.severity === 'MEDIUM' && 'bg-yellow-500'
                    } ${incident.severity === 'HIGH' && 'bg-orange-500'
                    } ${incident.severity === 'CRITICAL' && 'bg-destructive'
                    } text-white text-xs font-bold px-2 py-1`}>
                      {incident.severity === 'LOW' && 'منخفض'}
                      {incident.severity === 'MEDIUM' && 'متوسط'}
                      {incident.severity === 'HIGH' && 'عالي'}
                      {incident.severity === 'CRITICAL' && 'حرج'}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm mb-2 text-foreground">{incident.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{incident.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="space-x-2">
                      <Badge variant="outline" className="border-foreground/30 text-foreground">{incident.region}</Badge>
                      <Badge variant="outline" className="border-foreground/30 text-foreground">{incident.center}</Badge>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(incident.createdAt).toLocaleTimeString('ar-DZ')}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
