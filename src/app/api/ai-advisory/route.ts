import { NextRequest, NextResponse } from 'next/server'
import { aiAdvisoryService } from '@/lib/ai-advisory'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, incidents, units, weather, context, incidentId } = body

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'يجب تحديد نوع الاستشارة' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'predictive':
        if (!incidents || !units) {
          return NextResponse.json(
            { success: false, error: 'الحوادث والوحدات مطلوبة للتنبيهات التنبؤية' },
            { status: 400 }
          )
        }
        result = await aiAdvisoryService.getPredictiveAlerts(incidents, units)
        break

      case 'scenario':
        if (!incidentId && (!incidents || incidents.length === 0)) {
          return NextResponse.json(
            { success: false, error: 'الحادث مطلوب لمحاكاة السيناريوهات' },
            { status: 400 }
          )
        }
        const incident = incidents?.find((i: any) => i.id === incidentId) || incidents?.[0]
        result = await aiAdvisoryService.generateScenarios(incident, context || '')
        break

      case 'stress_test':
        if (!incidents || !units) {
          return NextResponse.json(
            { success: false, error: 'الحوادث والوحدات مطلوبة لاختبار الإجهاد' },
            { status: 400 }
          )
        }
        result = await aiAdvisoryService.runStressTest(incidents, units)
        break

      case 'risk_assessment':
        if (!incidents || !units) {
          return NextResponse.json(
            { success: false, error: 'الحوادث والوحدات مطلوبة لتقييم المخاطر' },
            { status: 400 }
          )
        }
        result = await aiAdvisoryService.assessRisk(incidents, units, weather || {})
        break

      case 'comprehensive':
        if (!incidents || !units) {
          return NextResponse.json(
            { success: false, error: 'الحوادث والوحدات مطلوبة للاستشارة الشاملة' },
            { status: 400 }
          )
        }
        result = await aiAdvisoryService.getComprehensiveAdvisory(incidents, units, weather || {}, context)
        break

      default:
        return NextResponse.json(
          { success: false, error: 'نوع استشارة غير معروف' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      ...result
    })

  } catch (error: any) {
    console.error('AI Advisory API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'فشل معالجة الاستشارة',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// GET endpoint للحصول على الاستشارات السابقة (من التخزين المؤقت)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || 'all'

    // في الإنتاج، هذا سيقرأ من Firestore
    // حالياً، سنعيد بيانات تجريبية

    const mockAdvisories = [
      {
        type: 'predictive',
        severity: 'HIGH',
        title: 'توقع تصعيد للحوادث الحرجة',
        description: 'بناءً على أنماط البيانات الحالية، يُتوقع زيادة بنسبة 35% في الحوادث الحرجة خلال الساعتين القادمتين',
        probability: 87,
        timeframe: '2-6 ساعات',
        affectedAreas: ['الجزائر المركزية', 'سطيف'],
        recommendation: 'ننصح بتجهيز وحدات إضافية في المناطق المعرضة',
        confidence: 87,
        createdAt: new Date().toISOString()
      },
      {
        type: 'scenario',
        severity: 'MEDIUM',
        title: 'سيناريو محتمل: انتشار الحرائق',
        description: 'في حال استمرار الظروف الجوية الحالية، احتمالية انتشار الحرائق للمناطق المجاورة',
        probability: 65,
        impact: 'متوسط - قد يؤثر على مناطق متعددة',
        estimatedResources: {
          units: 5,
          personnel: 25,
          time: '2-4 ساعات'
        },
        steps: [
          'مراقبة حالة الطقس',
          'تجهيز فرق إطفاء إضافية',
          'وضع خطط الطوارئ جاهزة',
          'إشعار السكان بالحالة'
        ],
        recommendation: 'تجهيز فرق إطفاء إضافية في المناطق المجاورة',
        confidence: 65,
        createdAt: new Date(Date.now() - 1800000).toISOString()
      }
    ]

    // تصفية حسب النوع
    const filteredAdvisories = type !== 'all'
      ? mockAdvisories.filter((a: any) => a.type === type)
      : mockAdvisories

    return NextResponse.json({
      success: true,
      advisories: filteredAdvisories.slice(0, limit),
      total: mockAdvisories.length
    })

  } catch (error: any) {
    console.error('Get AI Advisories Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'فشل الحصول على الاستشارات',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
