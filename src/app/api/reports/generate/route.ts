import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.operationCode) {
      return NextResponse.json(
        { error: 'operationCode is required' },
        { status: 400 }
      )
    }

    // Create temp directory for files
    const tempDir = path.join(process.cwd(), 'temp', 'reports')
    await fs.mkdir(tempDir, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportId = body.reportId || `RPT-${timestamp}`
    const outputPdf = path.join(tempDir, `${reportId}.pdf`)
    const inputJson = path.join(tempDir, `${reportId}.json`)

    // Prepare report data
    const reportData = {
      reportId,
      operationCode: body.operationCode,
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate || new Date().toISOString(),
      center: body.center || 'DGPC National Command Center',
      preparedBy: body.preparedBy || 'DGPC Operations Center',
      period: body.period,
      summary: body.summary || 'Standard operational period completed successfully.',
      incidents: body.incidents || [],
      units: body.units || [],
      decisions: body.decisions || [],
      performance: body.performance || {},
      footer: body.footer
    }

    // Write JSON input file
    await fs.writeFile(inputJson, JSON.stringify(reportData, null, 2))

    // Execute Python script
    const pythonScript = path.join(
      process.cwd(),
      'scripts',
      'pdf-generation',
      'generate_report.py'
    )

    const pythonExec = path.join(process.cwd(), 'pdf-env', 'bin', 'python3')

    return new Promise((resolve) => {
      const process = spawn(pythonExec, [pythonScript, inputJson, outputPdf])

      let stdout = ''
      let stderr = ''

      process.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      process.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      process.on('close', async (code) => {
        if (code !== 0) {
          console.error('PDF generation failed:', stderr)
          resolve(NextResponse.json(
            { error: 'Failed to generate PDF', details: stderr },
            { status: 500 }
          ))
          return
        }

        try {
          // Read the generated PDF
          const pdfBuffer = await fs.readFile(outputPdf)

          // Clean up temp files
          await fs.unlink(inputJson).catch(() => {})
          await fs.unlink(outputPdf).catch(() => {})

          // Return the PDF file
          resolve(
            new NextResponse(pdfBuffer, {
              status: 200,
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${reportId}.pdf"`,
                'Content-Length': pdfBuffer.length.toString()
              }
            })
          )
        } catch (error) {
          console.error('Error reading PDF file:', error)
          resolve(NextResponse.json(
            { error: 'Failed to read generated PDF' },
            { status: 500 }
          ))
        }
      })

      process.on('error', (error) => {
        console.error('Process error:', error)
        resolve(NextResponse.json(
          { error: 'Failed to execute PDF generation', details: error.message },
          { status: 500 }
        ))
      })
    })
  } catch (error) {
    console.error('Error in report generation:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate report',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
