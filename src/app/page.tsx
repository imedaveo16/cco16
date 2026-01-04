'use client'

import { useEffect } from 'react'
import { Shield, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  useEffect(() => {
    // التحقق من تسجيل الدخول والتوجيه
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const role = localStorage.getItem('userRole')

    if (isLoggedIn && role) {
      window.location.href = `/dashboard/${role.toLowerCase()}`
    } else {
      window.location.href = '/auth/login'
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-overlay">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary mb-4 glow-effect">
          <Shield className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground text-nasa-header">
          منصة القيادة والتحكم
        </h1>
        <p className="text-muted-foreground">جاري التوجيه...</p>
        <div className="loading-spinner mx-auto"></div>
        <Button
          onClick={() => window.location.href = '/auth/login'}
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          الذهاب لتسجيل الدخول
        </Button>
      </div>
    </div>
  )
}
