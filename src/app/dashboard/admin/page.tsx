'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, Settings, Activity, Key, Lock, AlertTriangle, Database, FileText, ArrowRight, Maximize, Minimize } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  id: string
  name: string
  email: string
  role: string
  centerId: string
  isActive: boolean
  lastSeenAt: string
}

interface SystemStatus {
  uptime: string
  activeUsers: number
  databaseSize: string
  apiCalls: number
  errors: number
}

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  action: string
  resource: string
  ipAddress: string
}

export default function AdministratorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPanelMinimized, setIsPanelMinimized] = useState(false)
  const [selectedSection, setSelectedSection] = useState<'overview' | 'users' | 'security' | 'audit' | 'settings'>('overview')

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role !== 'ADMINISTRATOR') {
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

  // بيانات تجريبية
  const systemStatus: SystemStatus = {
    uptime: '99.8%',
    activeUsers: 47,
    databaseSize: '2.4 GB',
    apiCalls: 125000,
    errors: 23
  }

  const users: User[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed.mohamed@civilprotection.dz',
      role: 'OPERATOR',
      centerId: 'مركز 01',
      isActive: true,
      lastSeenAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'فاطمة بن علي',
      email: 'fatma.benali@civilprotection.dz',
      role: 'SUPERVISOR',
      centerId: 'مركز 02',
      isActive: true,
      lastSeenAt: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: '3',
      name: 'كريم يوسف',
      email: 'kareem.yousef@civilprotection.dz',
      role: 'COMMANDER',
      centerId: 'مركز 01',
      isActive: true,
      lastSeenAt: new Date(Date.now() - 900000).toISOString()
    }
  ]

  const auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      userId: 'ahmed.mohamed',
      action: 'LOGIN',
      resource: 'Dashboard',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      userId: 'kareem.yousef',
      action: 'INCIDENT_UPDATE',
      resource: 'Incident API',
      ipAddress: '192.168.1.150'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userId: 'admin',
      action: 'USER_CREATED',
      resource: 'Admin Panel',
      ipAddress: '192.168.1.1'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* الترويسة - لوحة المسؤول */}
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
                    <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-white"></div>
                  </div>
                </div>
                {/* شعار مع نص */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 border border-destructive/50 flex items-center justify-center glow-effect">
                    <Shield className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="text-right border-r border-foreground/20 pr-4">
                    <p className="text-sm font-bold text-foreground tracking-wide">مسؤول النظام</p>
                    <p className="text-xs text-destructive font-semibold tracking-wide">لوحة الإدارة الشاملة</p>
                  </div>
                </div>
              </div>
            </div>

            {/* الوسط - الساعة */}
            <div className="flex-1 text-center">
              <div className="mono-font text-lg font-bold text-primary text-glow">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
              <div className="text-xs text-muted-foreground">
                UTC | ALG {currentTime.toLocaleTimeString('en-US', { timeZone: 'Africa/Algiers', hour12: false })}
              </div>
            </div>

            {/* اليسار - أزرار */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsPanelMinimized(!isPanelMinimized)} className="text-muted-foreground hover:text-foreground">
                {isPanelMinimized ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex overflow-hidden">
        {/* اللوحة اليسرى - التنقل والقوائم */}
        <aside className={`transition-all duration-300 ${isPanelMinimized ? 'w-0' : 'w-80'} border-l border-foreground/20 bg-card`}>
          {!isPanelMinimized && (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                <h2 className="text-nasa-header text-foreground mb-4">
                  <Settings className="w-5 h-5 text-primary mr-2" />
                  لوحة التحكم
                </h2>

                {/* قسم الإدارة */}
                <div className="space-y-2 mb-6">
                  <p className="text-xs text-nasa-label text-muted-foreground mb-2">الإدارة</p>
                  <Button
                    variant={selectedSection === 'overview' ? 'default' : 'ghost'}
                    className={`w-full justify-start nasa-button ${selectedSection === 'overview' ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5 text-foreground'}`}
                    onClick={() => setSelectedSection('overview')}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    نظرة عامة
                  </Button>
                  <Button
                    variant={selectedSection === 'users' ? 'default' : 'ghost'}
                    className={`w-full justify-start nasa-button ${selectedSection === 'users' ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5 text-foreground'}`}
                    onClick={() => setSelectedSection('users')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    إدارة المستخدمين
                  </Button>
                  <Button
                    variant={selectedSection === 'settings' ? 'default' : 'ghost'}
                    className={`w-full justify-start nasa-button ${selectedSection === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5 text-foreground'}`}
                    onClick={() => setSelectedSection('settings')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    إعدادات النظام
                  </Button>
                </div>

                {/* قسم الأمان */}
                <div className="space-y-2 mb-6">
                  <p className="text-xs text-nasa-label text-muted-foreground mb-2">الأمان</p>
                  <Button
                    variant={selectedSection === 'security' ? 'default' : 'ghost'}
                    className={`w-full justify-start nasa-button ${selectedSection === 'security' ? 'bg-destructive text-destructive-foreground' : 'hover:bg-foreground/5 text-foreground'}`}
                    onClick={() => setSelectedSection('security')}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    سياسات الأمان
                  </Button>
                  <Button
                    variant={selectedSection === 'audit' ? 'default' : 'ghost'}
                    className={`w-full justify-start nasa-button ${selectedSection === 'audit' ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5 text-foreground'}`}
                    onClick={() => setSelectedSection('audit')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    سجلات المراجعة
                  </Button>
                </div>

                {/* قسم النظام */}
                <div className="space-y-2">
                  <p className="text-xs text-nasa-label text-muted-foreground mb-2">النظام</p>
                  <Button variant="ghost" className="w-full justify-start hover:bg-foreground/5 text-foreground nasa-button">
                    <Database className="w-4 h-4 mr-2" />
                    قاعدة البيانات
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-foreground/5 text-foreground nasa-button">
                    <Key className="w-4 h-4 mr-2" />
                    مفاتيح API
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-foreground/5 text-foreground nasa-button">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    السجلات والخطأ
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </aside>

        {/* اللوحة المركزية */}
        <main className="flex-1 flex flex-col bg-background p-6 overflow-y-auto">
          {selectedSection === 'overview' && (
            <>
              <h2 className="text-nasa-header text-foreground mb-6">
                <Activity className="w-6 h-6 text-primary mr-2" />
                نظرة عامة على النظام
              </h2>

              {/* بطاقات حالة النظام */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="card-nasa card-nasa-hover p-6 tech-corners">
                  <div className="text-xs text-nasa-label text-muted-foreground mb-2">وقت التشغيل</div>
                  <div className="text-3xl font-bold text-primary text-glow">{systemStatus.uptime}</div>
                </Card>
                <Card className="card-nasa card-nasa-hover p-6 tech-corners">
                  <div className="text-xs text-nasa-label text-muted-foreground mb-2">المستخدمون النشطون</div>
                  <div className="text-3xl font-bold text-foreground">{systemStatus.activeUsers}</div>
                </Card>
                <Card className="card-nasa card-nasa-hover p-6 tech-corners">
                  <div className="text-xs text-nasa-label text-muted-foreground mb-2">حجم قاعدة البيانات</div>
                  <div className="text-2xl font-bold text-foreground">{systemStatus.databaseSize}</div>
                </Card>
                <Card className="card-nasa card-nasa-hover p-6 tech-corners">
                  <div className="text-xs text-nasa-label text-muted-foreground mb-2">استدعاءات API</div>
                  <div className="text-2xl font-bold text-foreground">{(systemStatus.apiCalls / 1000).toFixed(0)}K</div>
                </Card>
              </div>

              {/* التنبيهات */}
              {systemStatus.errors > 0 && (
                <Alert className="mb-6 bg-destructive/20 border-destructive/50">
                  <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
                  <AlertDescription className="text-destructive">
                    تم رصد {systemStatus.errors} خطأ في النظام في آخر 24 ساعة. يُنصح بمراجعة السجلات.
                  </AlertDescription>
                </Alert>
              )}

              {/* الرسوم البيانية البسيطة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="card-nasa p-6 tech-corners">
                  <h3 className="text-nasa-label text-muted-foreground mb-4">استغلال الموارد</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">الوحدات</span>
                        <span className="text-sm font-bold text-primary">75%</span>
                      </div>
                      <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">البيانات</span>
                        <span className="text-sm font-bold text-primary">68%</span>
                      </div>
                      <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">الشبكة</span>
                        <span className="text-sm font-bold text-primary">82%</span>
                      </div>
                      <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="card-nasa p-6 tech-corners">
                  <h3 className="text-nasa-label text-muted-foreground mb-4">إحصائيات الحوادث</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">إجمالي الحوادث</span>
                      <Badge className="bg-primary/20 text-primary">{45}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">حوادث نشطة</span>
                      <Badge className="bg-destructive/20 text-destructive">{12}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">محلولة اليوم</span>
                      <Badge className="bg-green-500/20 text-green-500">{33}</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}

          {selectedSection === 'users' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-nasa-header text-foreground">
                  <Users className="w-6 h-6 text-primary mr-2" />
                  إدارة المستخدمين
                </h2>
                <Button className="nasa-button bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Shield className="w-4 h-4 mr-2" />
                  إضافة مستخدم جديد
                </Button>
              </div>

              <Card className="card-nasa p-4 tech-corners">
                <ScrollArea className="max-h-[calc(100vh-200px)]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-foreground/10">
                        <th className="text-right text-xs text-nasa-label text-muted-foreground p-3">الاسم</th>
                        <th className="text-right text-xs text-nasa-label text-muted-foreground p-3">البريد الإلكتروني</th>
                        <th className="text-right text-xs text-nasa-label text-muted-foreground p-3">الدور</th>
                        <th className="text-right text-xs text-nasa-label text-muted-foreground p-3">المركز</th>
                        <th className="text-right text-xs text-nasa-label text-muted-foreground p-3">الحالة</th>
                        <th className="text-right text-xs text-nasa-label text-muted-foreground p-3">آخر ظهور</th>
                        <th className="text-right text-xs text-nasa-label text-muted-foreground p-3">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-foreground/10 hover:bg-foreground/5">
                          <td className="text-right text-sm p-3 text-foreground">{user.name}</td>
                          <td className="text-right text-sm p-3 text-muted-foreground">{user.email}</td>
                          <td className="text-right p-3">
                            <Badge className={`${
                              user.role === 'OPERATOR' && 'bg-blue-500/20 text-blue-500'
                            } ${user.role === 'SUPERVISOR' && 'bg-purple-500/20 text-purple-500'
                            } ${user.role === 'COMMANDER' && 'bg-orange-500/20 text-orange-500'
                            } text-xs font-bold`}>
                              {user.role === 'OPERATOR' && 'مشغل'}
                              {user.role === 'SUPERVISOR' && 'مشرف'}
                              {user.role === 'COMMANDER' && 'قائد'}
                            </Badge>
                          </td>
                          <td className="text-right text-sm p-3 text-muted-foreground">{user.centerId}</td>
                          <td className="text-right p-3">
                            <Badge className={user.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'} text-xs font-bold">
                              {user.isActive ? 'نشط' : 'غير نشط'}
                            </Badge>
                          </td>
                          <td className="text-right text-xs p-3 text-muted-foreground">
                            {new Date(user.lastSeenAt).toLocaleTimeString('ar-DZ')}
                          </td>
                          <td className="text-right p-3">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </Card>
            </>
          )}

          {selectedSection === 'security' && (
            <>
              <h2 className="text-nasa-header text-foreground mb-6">
                <Lock className="w-6 h-6 text-destructive mr-2" />
                سياسات الأمان
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-nasa p-6 tech-corners">
                  <h3 className="text-nasa-label text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    سياسات الوصول
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">المصادقة الثنائية (MFA)</span>
                      <Badge className="bg-green-500/20 text-green-500">مفعلة</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">انتهاء الجلسة</span>
                      <Badge className="bg-primary/20 text-primary">30 دقيقة</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">حد العمليات الفاشلة</span>
                      <span className="text-sm text-foreground">5 محاولات</span>
                    </div>
                  </div>
                </Card>

                <Card className="card-nasa p-6 tech-corners">
                  <h3 className="text-nasa-label text-foreground mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    حماية البيانات
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">التشفير أثناء النقل</span>
                      <Badge className="bg-green-500/20 text-green-500">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">تشفير قاعدة البيانات</span>
                      <Badge className="bg-green-500/20 text-green-500">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">النسخ الاحتياطي</span>
                      <Badge className="bg-primary/20 text-primary">يومي</Badge>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="card-nasa p-6 tech-corners">
                <h3 className="text-nasa-label text-foreground mb-4">مراقبة النشاط المشبوه</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">حظر الجغرافيا</span>
                    <Badge className="bg-destructive/20 text-destructive">مفعال</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">اكتشاف GPS المشبوه</span>
                    <Badge className="bg-destructive/20 text-destructive">مفعال</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">حد سرعة السير غير الطبيعي</span>
                    <span className="text-sm text-foreground">200 كم/س</span>
                  </div>
                </div>
              </Card>
            </>
          )}

          {selectedSection === 'audit' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-nasa-header text-foreground">
                  <FileText className="w-6 h-6 text-primary mr-2" />
                  سجلات المراجعة (Audit Trail)
                </h2>
                <Button variant="outline" className="text-foreground">
                  تصدير السجلات
                </Button>
              </div>

              <Card className="card-nasa p-4 tech-corners">
                <ScrollArea className="max-h-[calc(100vh-200px)]">
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-background/50 rounded border border-foreground/10">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-primary/20 text-primary text-xs">{log.action}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString('ar-DZ')}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">المستخدم:</span>
                            <span className="text-foreground font-mono">{log.userId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">المورد:</span>
                            <span className="text-foreground">{log.resource}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">IP:</span>
                            <span className="text-foreground font-mono">{log.ipAddress}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </>
          )}

          {selectedSection === 'settings' && (
            <>
              <h2 className="text-nasa-header text-foreground mb-6">
                <Settings className="w-6 h-6 text-primary mr-2" />
                إعدادات النظام
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-nasa p-6 tech-corners">
                  <h3 className="text-nasa-label text-foreground mb-4">إعدادات Firebase</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2">مفتاح Firebase</label>
                      <input
                        type="password"
                        value="AIzaSyXXXXXXXXXXXXXXXXXXXXXXX"
                        readOnly
                        className="w-full bg-background/50 border border-foreground/20 rounded px-3 py-2 text-foreground text-sm"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">حالة الاتصال</span>
                      <Badge className="bg-green-500/20 text-green-500">متصل</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="card-nasa p-6 tech-corners">
                  <h3 className="text-nasa-label text-foreground mb-4">إعدادات AI</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">LLM API</span>
                      <Badge className="bg-primary/20 text-primary">نشط</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">AI Advisory</span>
                      <Badge className="bg-primary/20 text-primary">مفعال</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">المحاكاة</span>
                      <Badge className="bg-primary/20 text-primary">متاحة</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="card-nasa p-6 tech-corners">
                  <h3 className="text-nasa-label text-foreground mb-4">إعدادات المنطقة الزمنية</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2">التوقيت الافتراضي</label>
                      <select className="w-full bg-background/50 border border-foreground/20 rounded px-3 py-2 text-foreground text-sm">
                        <option>Africa/Algiers (UTC+1)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2">اللغة</label>
                      <select className="w-full bg-background/50 border border-foreground/20 rounded px-3 py-2 text-foreground text-sm">
                        <option>العربية (Arabic)</option>
                      </select>
                    </div>
                  </div>
                </Card>

                <Card className="card-nasa p-6 tech-corners">
                  <h3 className="text-nasa-label text-foreground mb-4">إعدادات النظام</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">الوضع الداكن</span>
                      <Badge className="bg-primary/20 text-primary">دائم</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">إحصائيات الاستخدام</span>
                      <Badge className="bg-primary/20 text-primary">نشط</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">النسخ الاحتياطي التلقائي</span>
                      <Badge className="bg-green-500/20 text-green-500">كل 6 ساعات</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
