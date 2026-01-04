'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, AlertTriangle, User, Mail, Eye, EyeOff, Activity, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { authService } from '@/lib/auth/auth-service'
import type { LoginCredentials, MFACredentials } from '@/lib/auth/auth-service'
import { onAuthStateChanged, type User } from 'firebase/auth'

type UserRole = 'OPERATOR' | 'SUPERVISOR' | 'COMMANDER' | 'ADMINISTRATOR'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [requiresMfa, setRequiresMfa] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    // التحقق من حالة المصادقة
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (user) {
        // المستخدم مسجل الدخول بالفعل
        try {
          const userProfile = await authService.getCurrentUserProfile()
          if (userProfile) {
            // حفظ بيانات المستخدم في localStorage
            localStorage.setItem('userId', userProfile.uid)
            localStorage.setItem('userEmail', userProfile.email)
            localStorage.setItem('userRole', userProfile.role)
            localStorage.setItem('userName', userProfile.name)
            localStorage.setItem('userCenterId', userProfile.centerId)
            localStorage.setItem('isLoggedIn', 'true')

            // التوجيه للوحة التحكم المناسبة
            const dashboardPath = getDashboardPath(userProfile.role)
            window.location.href = `/dashboard/${dashboardPath}`
          }
        } catch (err) {
          console.error('Error loading user profile:', err)
          setIsLoading(false)
        }
      } else {
        // المستخدم غير مسجل الدخول
        setIsLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // التحقق من MFA إذا لزم
      if (requiresMfa) {
        if (mfaCode.length !== 6) {
          setError('يرجى إدخال رمز التحقق المكون من 6 أرقام')
          setIsLoading(false)
          return
        }

        // التحقق من رمز MFA (محاكاة - في الواقع ستحتاج خدمة MFA)
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (mfaCode === '123456') { // رمز تجريبي
          // تسجيل الدخول ناجح
          const credentials = { email, password }
          const userCredential = await authService.login(credentials)

          setMfaCode('')
          setRequiresMfa(false)
        } else {
          setError('رمز التحقق غير صحيح')
        }
        setIsLoading(false)
        return
      }

      // محاولة تسجيل الدخول الأساسية
      const credentials: LoginCredentials = { email, password }
      await authService.login(credentials)

      // إذا لم يحدث خطأ، سنتحقق من MFA في المستقبل
      // حالياً، سنعتمد تسجيل الدخول بدون MFA (للتطوير)

    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور')
      return
    }

    try {
      await authService.sendPasswordReset(email)
      setError('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني')
    } catch (err: any) {
      setError(err.message || 'فشل إرسال إيميل إعادة تعيين كلمة المرور')
    }
  }

  const getDashboardPath = (role: UserRole): string => {
    switch (role) {
      case 'ADMINISTRATOR':
        return 'admin'
      case 'COMMANDER':
        return 'commander'
      case 'SUPERVISOR':
        return 'supervisor'
      case 'OPERATOR':
      default:
        return 'operator'
    }
  }

  const getUserRoleFromEmail = (email: string): UserRole => {
    // في الواقع، سيتم جلب الدور من Firebase Auth
    // هذا مجرد احتياط لتوجيه الصفحة
    if (email.includes('admin')) return 'ADMINISTRATOR'
    if (email.includes('commander')) return 'COMMANDER'
    if (email.includes('supervisor')) return 'SUPERVISOR'
    return 'OPERATOR'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* شبكة الخلفية */}
      <div className="absolute inset-0 grid-overlay opacity-20"></div>

      {/* تأثيرات الإضاءة */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-destructive opacity-10 blur-3xl rounded-full"></div>

      <div className="relative z-10 w-full max-w-md p-8">
        {/* شعار وعنوان */}
        <div className="text-center mb-8">
          {/* شعار الحماية المدنية - الشعار الجديد */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary mb-4 glow-effect">
            <img src="/new-logo.png" alt="شعار الحماية المدنية" className="w-16 h-16 object-contain" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2 text-nasa-header">
            منصة القيادة والتحكم
          </h1>
          <p className="text-muted-foreground text-sm">
            المديرية العامة للحماية المدنية الجزائرية
          </p>
          <div className="mt-4 inline-block px-4 py-1 bg-primary/20 border border-primary/50 rounded-full">
            <span className="text-xs text-primary font-semibold tracking-wider">V1.1 - NASA STYLE</span>
          </div>
        </div>

        {/* بطاقة تسجيل الدخول */}
        <div className="card-nasa rounded-lg p-6 tech-corners">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* حقل البريد الإلكتروني */}
            <div className="space-y-2">
              <label className="text-nasa-label flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@civilprotection.dz"
                  className="bg-background border-foreground/20 text-foreground"
                  disabled={isLoading || isAuthenticating}
                  autoComplete="email"
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div className="space-y-2">
              <label className="text-nasa-label flex items-center gap-2">
                <Lock className="w-4 h-4" />
                كلمة المرور
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  className="bg-background border-foreground/20 text-foreground pr-10"
                  disabled={isLoading || isAuthenticating}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading || isAuthenticating}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* حقل MFA (يظهر فقط إذا لزم) */}
            {requiresMfa && (
              <div className="space-y-2">
                <label className="text-nasa-label flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  رمز التحقق الثنائي (MFA)
                </label>
                <Input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="bg-background border-foreground/20 text-foreground text-center text-2xl tracking-widest"
                  maxLength={6}
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  تم إرسال رمز التحقق إلى هاتفك المسجل
                </p>
              </div>
            )}

            {/* رسالة الخطأ */}
            {error && (
              <Alert className="bg-destructive/20 border-destructive/50">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            {/* زر تسجيل الدخول */}
            <Button
              type="submit"
              className="w-full nasa-button bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 tech-corners"
              disabled={isLoading || isAuthenticating || !email || !password}
            >
              {isLoading || isAuthenticating ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{requiresMfa ? 'جاري التحقق...' : 'جاري تسجيل الدخول...'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  <span>{requiresMfa ? 'تسجيل الدخول' : 'إرسال رمز التحقق'}</span>
                </div>
              )}
            </Button>
          </form>

          {/* إعادة تعيين كلمة المرور */}
          <div className="mt-6 pt-6 border-t border-foreground/10">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 font-semibold"
              disabled={isLoading}
            >
              نسيت كلمة المرور؟
            </button>
          </div>
        </div>

        {/* معلومات تسجيل الدخول التجريبي */}
        <div className="mt-6 p-4 bg-background/50 rounded border border-foreground/10 text-xs space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-foreground">حسابات تجريبية (للتطوير):</p>
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Firebase Auth</Badge>
          </div>
          <div className="space-y-1 text-muted-foreground">
            <p>• <span className="text-primary font-mono">operator@</span> - مشغل</p>
            <p>• <span className="text-primary font-mono">supervisor@</span> - مشرف</p>
            <p>• <span className="text-primary font-mono">commander@</span> - قائد</p>
            <p>• <span className="text-primary font-mono">admin@</span> - مسؤول</p>
          </div>
          <p className="text-muted-foreground/60 mt-3">
            كلمة المرور التجريبية: <span className="font-mono text-foreground">password123</span>
          </p>
          <p className="text-muted-foreground/60 mt-1">
            للتنجيز: استخدم أي بريد + password123
          </p>
        </div>

        {/* زر إنشاء حساب */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground mb-2">
            ليس لديك حساب؟
          </p>
          <Button variant="outline" className="w-full">
            <ArrowRight className="w-4 h-4 mr-2" />
            إنشاء حساب جديد
          </Button>
        </div>
      </div>

      {/* تذييل */}
      <div className="text-center mt-8 text-xs text-muted-foreground">
        <p>منصة القيادة والتحكم © 2024</p>
        <p className="mt-1">المديرية العامة للحماية المدنية الجزائرية</p>
        <p className="mt-2 text-xs text-primary/60">
          نظام أمان Zero-Trust مع Audit Trail
        </p>
      </div>
    </div>
  )
}
