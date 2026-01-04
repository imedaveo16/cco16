'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, Settings, Activity, Lock, Database, FileText, ArrowRight, Maximize, Minimize } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface User {
  id: string
  name: string
  email: string
  role: string
  centerId: string
  isActive: boolean
}

export default function AdministratorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPanelMinimized, setIsPanelMinimized] = useState(false)
  const [selectedSection, setSelectedSection] = useState<'overview' | 'users' | 'settings'>('overview')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-foreground/20 bg-card tech-corners">
        <div className="p-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-destructive/20 border border-destructive/50 flex items-center justify-center">
                <img src="/civil-protection-logo.png" alt="شعار الحماية المدنية" className="w-6 h-6" />
              </div>
              <div className="text-right border-r border-foreground/20 pr-4">
                <p className="text-sm font-bold text-foreground tracking-wide">مسؤول النظام</p>
                <p className="text-xs text-destructive font-semibold tracking-wide">لوحة الإدارة الشاملة</p>
              </div>
            </div>

            <div className="flex-1 text-center">
              <div className="mono-font text-lg font-bold text-primary text-glow">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
              <div className="text-xs text-muted-foreground">
                UTC | ALG {currentTime.toLocaleTimeString('en-US', { timeZone: 'Africa/Algiers', hour12: false })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsPanelMinimized(!isPanelMinimized)}>
                {isPanelMinimized ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`transition-all duration-300 ${isPanelMinimized ? 'w-0' : 'w-80'} border-l border-foreground/20 bg-card`}>
          {!isPanelMinimized && (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                <h2 className="text-nasa-header text-foreground mb-4">
                  <Settings className="w-5 h-5 text-primary mr-2" />
                  لوحة التحكم
                </h2>

                <Button
                  variant={selectedSection === 'overview' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedSection('overview')}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  نظرة عامة
                </Button>

                <Button
                  variant={selectedSection === 'users' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedSection('users')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  إدارة المستخدمين
                </Button>

                <Button
                  variant={selectedSection === 'settings' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedSection('settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  إعدادات النظام
                </Button>
              </div>
            </ScrollArea>
          )}
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {selectedSection === 'overview' && (
            <>
              <h2 className="text-nasa-header text-foreground mb-6">
                <Activity className="w-6 h-6 text-primary mr-2" />
                نظرة عامة على النظام
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="card-nasa card-nasa-hover p-6 tech-corners">
                  <div className="text-xs text-nasa-label text-muted-foreground mb-2">وقت التشغيل</div>
                  <div className="text-3xl font-bold text-primary text-glow">99.8%</div>
                </Card>
                <Card className="card-nasa card-nasa-hover p-6 tech-corners">
                  <div className="text-xs text-nasa-label text-muted-foreground mb-2">المستخدمون النشطون</div>
                  <div className="text-3xl font-bold text-foreground">47</div>
                </Card>
                <Card className="card-nasa card-nasa-hover p-6 tech-corners">
                  <div className="text-xs text-nasa-label text-muted-foreground mb-2">حجم قاعدة البيانات</div>
                  <div className="text-2xl font-bold text-foreground">2.4 GB</div>
                </Card>
                <Card className="card-nasa card-nasa-hover p-6 tech-corners">
                  <div className="text-xs text-nasa-label text-muted-foreground mb-2">استدعاءات API</div>
                  <div className="text-2xl font-bold text-foreground">125K</div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-nasa p-6 tech-corners">
                  <h3 className="text-nasa-label text-muted-foreground mb-4">إحصائيات الحوادث</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">إجمالي الحوادث</span>
                      <Badge className="bg-primary/20 text-primary">45</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">حوادث نشطة</span>
                      <Badge className="bg-destructive/20 text-destructive">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">محلولة اليوم</span>
                      <Badge className="bg-green-500/20 text-green-500">33</Badge>
                    </div>
                  </div>
                </Card>
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
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
                        <th className="text-right text-xs text-nasa-label text-muted-foreground p-3">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="text-right text-sm p-3 text-foreground">أحمد محمد</td>
                        <td className="text-right text-sm p-3 text-muted-foreground">ahmed.mohamed@civilprotection.dz</td>
                        <td className="text-right p-3">
                          <Badge className="bg-blue-500/20 text-blue-500 text-xs font-bold">مشغل</Badge>
                        </td>
                        <td className="text-right p-3">
                          <Badge className="bg-green-500/20 text-green-500 text-xs font-bold">نشط</Badge>
                        </td>
                      </tr>
                      <tr className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="text-right text-sm p-3 text-foreground">فاطمة بن علي</td>
                        <td className="text-right text-sm p-3 text-muted-foreground">fatma.benali@civilprotection.dz</td>
                        <td className="text-right p-3">
                          <Badge className="bg-purple-500/20 text-purple-500 text-xs font-bold">مشرف</Badge>
                        </td>
                        <td className="text-right p-3">
                          <Badge className="bg-green-500/20 text-green-500 text-xs font-bold">نشط</Badge>
                        </td>
                      </tr>
                      <tr className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="text-right text-sm p-3 text-foreground">كريم يوسف</td>
                        <td className="text-right text-sm p-3 text-muted-foreground">kareem.yousef@civilprotection.dz</td>
                        <td className="text-right p-3">
                          <Badge className="bg-orange-500/20 text-orange-500 text-xs font-bold">قائد</Badge>
                        </td>
                        <td className="text-right p-3">
                          <Badge className="bg-green-500/20 text-green-500 text-xs font-bold">نشط</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
