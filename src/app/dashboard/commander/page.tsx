'use client'

import { useState, useEffect } from 'react'
import { Shield, Brain, Activity, Map, TrendingUp, Users, AlertTriangle, Eye, RotateCcw, Play, Maximize, Minimize, Zap, BarChart3, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXTREME'

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

interface AIAdvisory {
  type: 'predictive' | 'scenario' | 'stress_test'
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  title: string
  description: string
  recommendation: string
  confidence: number
}

interface StatCard {
  label: string
  value: string
  trend: 'up' | 'down' | 'stable'
  icon: any
}

export default function CommanderDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPanelMinimized, setIsPanelMinimized] = useState(false)
  const [isShadowMode, setIsShadowMode] = useState(false)
  const [isDrillMode, setIsDrillMode] = useState(false)
  const [isReplayMode, setIsReplayMode] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'incidents' | 'ai' | 'analytics'>('overview')
  const [isRedMode, setIsRedMode] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role !== 'COMMANDER') {
      window.location.href = '/auth/login'
      return
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/auth/login'
  }

  // الإحصائيات
  const stats: StatCard[] = [
    {
      label: 'حوادث نشطة',
      value: '12',
      trend: 'up',
      icon: Activity
    },
    {
      label: 'نسبة الاستجابة',
      value: '94.5%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      label: 'الوحدات المُنشر',
      value: '18/24',
      trend: 'stable',
      icon: Users
    },
    {
      label: 'تنبيهات AI',
      value: '3',
      trend: 'down',
      icon: Brain
    }
  ]

  // الحوادث
  const incidents: Incident[] = [
    {
      id: '1',
      incidentId: 'INC-2024-001',
      title: 'حريق في مبنى سكني - الجزائر المركزية',
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
      title: 'تصادم مركبات على الطريق السريع شرق-غرب',
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
      title: 'فيضانات محلية في سطيف',
      description: 'أمطار غزيرة تسبب فيضانات محلية',
      severity: 'MEDIUM',
      status: 'MONITORING',
      region: 'سطيف',
      center: 'مركز 03',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ]

  // استشارات AI
  const aiAdvisories: AIAdvisory[] = [
    {
      type: 'predictive',
      severity: 'HIGH',
      title: 'توقع تصعيد للحوادث الحرجة',
      description: 'بناءً على أنماط البيانات الحالية، يُتوقع زيادة بنسبة 35% في الحوادث الحرجة خلال الساعتين القادمتين',
      recommendation: 'ننصح بتجهيز وحدات إضافية في المناطق المعرضة',
      confidence: 87
    },
    {
      type: 'scenario',
      severity: 'MEDIUM',
      title: 'سيناريو محتمل: انتشار الحرائق',
      description: 'في حال استمرار الظروف الجوية الحالية، احتمالية انتشار الحرائق للمناطق المجاورة',
      recommendation: 'تجهيز فرق إطفاء إضافية في المناطق المجاورة',
      confidence: 65
    },
    {
      type: 'stress_test',
      severity: 'LOW',
      title: 'اختبار الإجهاد: النظام في حالة جيدة',
      description: 'قدرة النظام الحالية تدعم الحمل الحالي بهامش 40%',
      recommendation: 'النظام يعمل بكفاءة عالية. يُنصح بالاستمرار في المراقبة الروتينية',
      confidence: 92
    }
  ]

  const getSeverityColor = (severity: Severity): string => {
    const colors = {
      LOW: 'border-green-500 bg-green-500/10',
      MEDIUM: 'border-yellow-500 bg-yellow-500/10',
      HIGH: 'border-orange-500 bg-orange-500/10',
      CRITICAL: 'border-red-600 bg-red-600/10',
      EXTREME: 'border-red-700 bg-red-700/10'
    }
    return colors[severity]
  }

  const getSeverityText = (severity: Severity): string => {
    const texts = {
      LOW: 'منخفض',
      MEDIUM: 'متوسط',
      HIGH: 'عالي',
      CRITICAL: 'حرج',
      EXTREME: 'شديد'
    }
    return texts[severity]
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* تأثيرات الأوضاع */}
      {isShadowMode && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-yellow-500/90 text-white px-6 py-3 rounded-lg border-2 border-yellow-400">
            <Eye className="w-6 h-6 mr-2 inline" />
            <span className="text-xl font-bold">وضع المراقبة - بدون تنبيهات</span>
          </div>
        </div>
      )}

      {isDrillMode && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-red-600/90 text-white px-8 py-4 rounded-lg border-4 border-red-500 transform -rotate-12">
            <Play className="w-8 h-8 mr-2 inline" />
            <span className="text-4xl font-bold">تدريب - غير حقيقي</span>
          </div>
        </div>
      )}

      {isReplayMode && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-purple-600/90 text-white px-6 py-3 rounded-lg border-2 border-purple-500">
            <RotateCcw className="w-6 h-6 mr-2 inline" />
            <span className="text-xl font-bold">وضع الإعادة</span>
          </div>
        </div>
      )}

      {isRedMode && (
        <div className="fixed inset-0 pointer-events-none z-40 bg-red-600/20 nasa-alert-flash"></div>
      )}

      {/* الترويسة - لوحة القائد */}
      <header className="border-b border-foreground/20 bg-card tech-corners">
        <div className="p-2">
          <div className="flex items-center justify-between gap-4">
            {/* اليمين - الهوية */}
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
                {/* شعار + علم */}
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center glow-effect">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="text-right border-r border-foreground/20 pr-4">
                <p className="text-sm font-bold text-foreground tracking-wide">القائد الوطني</p>
                <p className="text-xs text-primary font-semibold tracking-wide">لوحة القيادة الاستراتيجية</p>
              </div>
            </div>

            {/* الوسط - الساعة + حالة */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="mono-font text-2xl font-bold text-primary text-glow">
                  {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                </div>
                <div className="text-xs text-muted-foreground">
                  <div>UTC {currentTime.getUTCHours()}:{String(currentTime.getUTCMinutes()).padStart(2, '0')}</div>
                  <div>ALG {currentTime.toLocaleTimeString('en-US', { timeZone: 'Africa/Algiers', hour12: false })}</div>
                </div>
              </div>
            </div>

            {/* اليسار - أوضاع + زر خروج */}
            <div className="flex items-center gap-3">
              {/* أزرار الأوضاع */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isShadowMode ? "default" : "outline"}
                  onClick={() => setIsShadowMode(!isShadowMode)}
                  title="وضع المراقبة"
                  className={isShadowMode ? "bg-yellow-500 text-white" : ""}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={isDrillMode ? "default" : "outline"}
                  onClick={() => setIsDrillMode(!isDrillMode)}
                  title="وضع التدريب"
                  className={isDrillMode ? "bg-red-600 text-white" : ""}
                >
                  <Play className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={isReplayMode ? "default" : "outline"}
                  onClick={() => setIsReplayMode(!isReplayMode)}
                  title="وضع الإعادة"
                  className={isReplayMode ? "bg-purple-600 text-white" : ""}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <div className="w-px h-6 bg-foreground/20"></div>

              {/* زر RED MODE */}
              <Button
                size="sm"
                variant={isRedMode ? "default" : "destructive"}
                onClick={() => setIsRedMode(!isRedMode)}
                className={isRedMode ? "nasa-alert-flash" : ""}
              >
                <Zap className="w-4 h-4 mr-2" />
                {isRedMode ? "طوارئ مفعال" : "طوارئ"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPanelMinimized(!isPanelMinimized)}
              >
                {isPanelMinimized ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex overflow-hidden">
        {/* اللوحة اليسرى - التنقل والإحصائيات */}
        <aside className={`transition-all duration-300 ${isPanelMinimized ? 'w-0' : 'w-80'} border-l border-foreground/20 bg-card`}>
          {!isPanelMinimized && (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* التنقل بين التبويبات */}
                <div className="space-y-2">
                  <Button
                    variant={selectedTab === 'overview' ? "default" : "ghost"}
                    className={`w-full justify-start nasa-button ${selectedTab === 'overview' ? 'bg-primary' : ''}`}
                    onClick={() => setSelectedTab('overview')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    نظرة عامة
                  </Button>
                  <Button
                    variant={selectedTab === 'incidents' ? "default" : "ghost"}
                    className={`w-full justify-start nasa-button ${selectedTab === 'incidents' ? 'bg-primary' : ''}`}
                    onClick={() => setSelectedTab('incidents')}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    الحوادث
                  </Button>
                  <Button
                    variant={selectedTab === 'ai' ? "default" : "ghost"}
                    className={`w-full justify-start nasa-button ${selectedTab === 'ai' ? 'bg-primary' : ''}`}
                    onClick={() => setSelectedTab('ai')}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    استشارات AI
                  </Button>
                  <Button
                    variant={selectedTab === 'analytics' ? "default" : "ghost"}
                    className={`w-full justify-start nasa-button ${selectedTab === 'analytics' ? 'bg-primary' : ''}`}
                    onClick={() => setSelectedTab('analytics')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    التحليلات
                  </Button>
                </div>

                {/* الإحصائيات */}
                {selectedTab === 'overview' && (
                  <div className="space-y-4">
                    <h3 className="text-nasa-label text-muted-foreground mb-3">الإحصائيات الحية</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {stats.map((stat, index) => (
                        <Card key={index} className="card-nasa card-nasa-hover p-4 tech-corners">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <stat.icon className="w-4 h-4 text-primary" />
                              <span className="text-xs text-muted-foreground">{stat.label}</span>
                            </div>
                            {stat.trend === 'up' && (
                              <Badge className="bg-green-500/20 text-green-500 border-green-500/50 text-xs">
                                <TrendingUp className="w-3 h-3" />
                              +12%
                              </Badge>
                            )}
                          </div>
                          <div className="text-3xl font-bold text-foreground text-glow">{stat.value}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </aside>

        {/* اللوحة المركزية */}
        <main className="flex-1 flex flex-col bg-background">
          {selectedTab === 'overview' && (
            <>
              <div className="p-4 border-b border-foreground/10">
                <h2 className="text-nasa-header text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  الحوادث النشطة في الولاية
                </h2>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {incidents.map((incident) => (
                    <Card key={incident.id} className={`card-nasa card-nasa-hover p-4 tech-corners ${getSeverityColor(incident.severity)} ${incident.status === 'ACTIVE' ? 'glow-border nasa-pulse' : ''}`}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex gap-2">
                          <Badge className="bg-primary text-white text-xs font-bold px-2 py-1">
                            {incident.incidentId}
                          </Badge>
                          <Badge className={`text-white text-xs font-bold px-2 py-1 ${
                            incident.severity === 'LOW' && 'bg-green-500'
                          } ${incident.severity === 'MEDIUM' && 'bg-yellow-500'
                          } ${incident.severity === 'HIGH' && 'bg-orange-500'
                          } ${incident.severity === 'CRITICAL' && 'bg-destructive'
                          }`}>
                            {getSeverityText(incident.severity)}
                          </Badge>
                        </div>
                        <Badge variant="outline" className={`border-foreground/30 text-foreground text-xs ${
                          incident.status === 'ACTIVE' && 'nasa-blink'
                        }`}>
                          {incident.status}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-sm mb-2 text-foreground">{incident.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{incident.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="space-x-2">
                          <Badge variant="outline" className="border-foreground/30">{incident.region}</Badge>
                          <Badge variant="outline" className="border-foreground/30">{incident.center}</Badge>
                        </div>
                        <span>{new Date(incident.createdAt).toLocaleTimeString('ar-DZ')}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedTab === 'ai' && (
            <>
              <div className="p-4 border-b border-foreground/10">
                <h2 className="text-nasa-header text-foreground flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary nasa-pulse" />
                  استشارات الذكاء الاصطناعي
                </h2>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {aiAdvisories.map((advisory, index) => (
                    <Card key={index} className={`card-nasa p-5 tech-corners border-l-4 ${
                      advisory.severity === 'HIGH' && 'border-destructive'
                    } ${advisory.severity === 'MEDIUM' && 'border-yellow-500'
                    } ${advisory.severity === 'LOW' && 'border-green-500'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-white text-xs font-bold px-2 py-1 ${
                            advisory.type === 'predictive' && 'bg-blue-500'
                          } ${advisory.type === 'scenario' && 'bg-purple-500'
                          } ${advisory.type === 'stress_test' && 'bg-primary'
                          }`}>
                            {advisory.type === 'predictive' && 'تنبؤي'}
                            {advisory.type === 'scenario' && 'سيناريو'}
                            {advisory.type === 'stress_test' && 'اختبار إجهاد'}
                          </Badge>
                          <Badge className={`${
                            advisory.severity === 'HIGH' && 'bg-destructive/20 text-destructive'
                          } ${advisory.severity === 'MEDIUM' && 'bg-yellow-500/20 text-yellow-500'
                          } ${advisory.severity === 'LOW' && 'bg-green-500/20 text-green-500'
                          } text-xs font-bold px-2 py-1`}>
                            {getSeverityText(advisory.severity)} الأهمية
                          </Badge>
                        </div>
                        <Badge className="bg-primary/20 text-primary text-xs">
                          {advisory.confidence}% ثقة
                        </Badge>
                      </div>

                      <h3 className="font-bold text-sm mb-2 text-foreground">{advisory.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{advisory.description}</p>

                      <div className="p-3 bg-background/50 rounded border border-foreground/10">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm font-semibold text-primary">التوصية:</span>
                        </div>
                        <p className="text-sm text-foreground mr-2">{advisory.recommendation}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedTab === 'analytics' && (
            <>
              <div className="p-4 border-b border-foreground/10">
                <h2 className="text-nasa-header text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  التحليلات والإحصائيات
                </h2>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="card-nasa p-4 tech-corners">
                    <h4 className="text-nasa-label text-foreground mb-4">أداء الاستجابة</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">متوسط وقت الاستجابة</span>
                        <span className="text-2xl font-bold text-primary text-glow">8.2 دقيقة</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">نسبة الاستجابة &lt; 10 دقائق</span>
                        <span className="text-2xl font-bold text-green-500">92.5%</span>
                      </div>
                      <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '92.5%' }}></div>
                      </div>
                    </div>
                  </Card>

                  <Card className="card-nasa p-4 tech-corners">
                    <h4 className="text-nasa-label text-foreground mb-4">توزيع الحوادث</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">حرجة</span>
                        <Badge className="bg-destructive/20 text-destructive">3 (6.7%)</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">عالية</span>
                        <Badge className="bg-orange-500/20 text-orange-500">7 (15.5%)</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">متوسطة</span>
                        <Badge className="bg-yellow-500/20 text-yellow-500">21 (46.7%)</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">منخفضة</span>
                        <Badge className="bg-green-500/20 text-green-500">14 (31.1%)</Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="card-nasa p-4 tech-corners">
                    <h4 className="text-nasa-label text-foreground mb-4">أداء الوحدات</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">وحدات نشطة</span>
                        <span className="text-2xl font-bold text-primary">18</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">وحدات احتياطية</span>
                        <span className="text-2xl font-bold text-status-active">6</span>
                      </div>
                      <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">استغلال الموارد: 75%</p>
                    </div>
                  </Card>

                  <Card className="card-nasa p-4 tech-corners">
                    <h4 className="text-nasa-label text-foreground mb-4">اتجاه الأسبوع</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">اليوم</span>
                        <Badge className="bg-green-500/20 text-green-500">جيد</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">هذا الأسبوع</span>
                        <Badge className="bg-primary/20 text-primary">ممتاز</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        الحوادث المحلولة: 38/45 (84.4%)
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>

        {/* اللوحة اليمنى - قائمة الحوادث للقائد */}
        <aside className={`transition-all duration-300 ${isPanelMinimized ? 'w-0' : 'w-96'} border-r border-foreground/20 bg-card`}>
          {!isPanelMinimized && (
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="text-nasa-header text-foreground mb-4">
                  <AlertTriangle className="w-5 h-5 text-destructive mr-2" />
                  جميع الحوادث
                </h3>
                <div className="space-y-3">
                  {incidents.map((incident) => (
                    <Card key={incident.id} className={`card-nasa card-nasa-hover p-3 tech-corners cursor-pointer ${getSeverityColor(incident.severity)}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge className="bg-primary text-white text-xs font-bold px-2 py-1">
                          {incident.incidentId}
                        </Badge>
                        <Badge variant="outline" className={`border-foreground/30 text-foreground text-xs ${
                          incident.status === 'ACTIVE' && 'nasa-blink'
                        }`}>
                          {incident.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-1 text-foreground">{incident.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{incident.region}</span>
                        <span>•</span>
                        <span>{incident.center}</span>
                        <span>•</span>
                        <span>{new Date(incident.createdAt).toLocaleTimeString('ar-DZ')}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </aside>
      </div>
    </div>
  )
}

// تصدير ArrowRight للاستخدام
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
