#!/usr/bin/env python3
"""
DGPC Ministerial Report Generator
Generates professional PDF reports for post-mission analysis
"""

import sys
import json
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT


def generate_report(data, output_path):
    """Generate ministerial PDF report from incident data"""

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )

    # Custom styles
    styles = getSampleStyleSheet()

    # Title style
    title_style = ParagraphStyle(
        'DGPC_Title',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#1a1a1a'),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )

    # Header style
    header_style = ParagraphStyle(
        'DGPC_Header',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#333333'),
        spaceBefore=15,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    )

    # Subheader style
    subheader_style = ParagraphStyle(
        'DGPC_Subheader',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=colors.HexColor('#666666'),
        spaceBefore=10,
        spaceAfter=5,
        fontName='Helvetica-Bold'
    )

    # Body style
    body_style = ParagraphStyle(
        'DGPC_Body',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#333333'),
        spaceAfter=8,
        alignment=TA_LEFT,
        fontName='Helvetica'
    )

    # Critical style
    critical_style = ParagraphStyle(
        'DGPC_Critical',
        parent=body_style,
        textColor=colors.HexColor('#dc2626'),
        fontName='Helvetica-Bold'
    )

    story = []

    # === HEADER SECTION ===
    story.append(Paragraph("DIRECTORATE GENERAL OF CIVIL PROTECTION ALGERIA", title_style))
    story.append(Spacer(1, 0.2*cm))

    story.append(Paragraph("POST-MISSION ANALYSIS REPORT", header_style))
    story.append(Spacer(1, 0.3*cm))

    # Report metadata table
    metadata_data = [
        ['Report ID:', data.get('reportId', f'RPT-{datetime.now().strftime("%Y%m%d-%H%M%S")}')],
        ['Generated:', datetime.now().strftime('%Y-%m-%d %H:%M:%S')],
        ['Operation Code:', data.get('operationCode', 'N/A')],
        ['Report Period:', data.get('period', f"{data.get('startDate', 'N/A')} - {data.get('endDate', 'N/A')}")],
        ['Center:', data.get('center', 'N/A')],
        ['Prepared By:', data.get('preparedBy', 'DGPC Operations Center')]
    ]

    metadata_table = Table(metadata_data, colWidths=[4*cm, 10*cm])
    metadata_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#666666')),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e0e0e0')),
        ('ROWBACKGROUNDS', (0, 0), (0, -1), [colors.HexColor('#f5f5f5') if i % 2 == 0 else colors.white for i in range(len(metadata_data))])
    ]))

    story.append(metadata_table)
    story.append(Spacer(1, 0.5*cm))

    # === EXECUTIVE SUMMARY ===
    story.append(Paragraph("EXECUTIVE SUMMARY", header_style))

    summary_text = data.get('summary', 'No summary provided.')
    for paragraph in summary_text.split('\n'):
        story.append(Paragraph(paragraph, body_style))

    story.append(Spacer(1, 0.3*cm))

    # === INCIDENTS OVERVIEW ===
    story.append(Paragraph("INCIDENTS OVERVIEW", header_style))

    incidents = data.get('incidents', [])
    if incidents:
        # Statistics
        total_incidents = len(incidents)
        critical_count = sum(1 for i in incidents if i.get('severity') in ['CRITICAL', 'EXTREME'])
        resolved_count = sum(1 for i in incidents if i.get('status') == 'CLOSED')

        stats_data = [
            ['Total Incidents:', str(total_incidents)],
            ['Critical/Extreme:', str(critical_count)],
            ['Resolved:', str(resolved_count)],
            ['Response Rate:', f"{(resolved_count/total_incidents*100):.1f}%" if total_incidents > 0 else '0%']
        ]

        stats_table = Table(stats_data, colWidths=[5*cm, 5*cm])
        stats_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e0e0e0'))
        ]))

        story.append(stats_table)
        story.append(Spacer(1, 0.3*cm))

        # Incidents table
        incident_headers = ['Incident ID', 'Title', 'Severity', 'Status', 'Location', 'Date']
        incident_rows = [incident_headers]

        for incident in incidents:
            row = [
                incident.get('incidentId', 'N/A'),
                incident.get('title', 'N/A')[:50],
                incident.get('severity', 'N/A'),
                incident.get('status', 'N/A'),
                incident.get('address', 'N/A')[:30],
                incident.get('createdAt', 'N/A')[:10]
            ]
            incident_rows.append(row)

        incident_table = Table(incident_rows, colWidths=[2.5*cm, 3*cm, 1.5*cm, 1.5*cm, 3*cm, 2.5*cm])
        incident_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e0e0e0')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [
                colors.white if i % 2 == 0 else colors.HexColor('#f9f9f9')
                for i in range(len(incident_rows) - 1)
            ])
        ]))

        story.append(incident_table)
    else:
        story.append(Paragraph("No incidents recorded during this period.", body_style))

    story.append(Spacer(1, 0.5*cm))

    # === UNIT OPERATIONS ===
    story.append(Paragraph("UNIT OPERATIONS", header_style))

    units = data.get('units', [])
    if units:
        unit_stats = {
            'total': len(units),
            'on_duty': sum(1 for u in units if u.get('status') == 'ON_DUTY'),
            'engaged': sum(1 for u in units if u.get('status') == 'ENGAGED'),
            'maintenance': sum(1 for u in units if u.get('status') == 'MAINTENANCE')
        }

        unit_stats_data = [
            ['Total Units:', str(unit_stats['total'])],
            ['On Duty:', str(unit_stats['on_duty'])],
            ['Engaged:', str(unit_stats['engaged'])],
            ['In Maintenance:', str(unit_stats['maintenance'])]
        ]

        unit_stats_table = Table(unit_stats_data, colWidths=[5*cm, 5*cm])
        unit_stats_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e0e0e0'))
        ]))

        story.append(unit_stats_table)
    else:
        story.append(Paragraph("No unit data available for this period.", body_style))

    story.append(Spacer(1, 0.5*cm))

    # === DECISION LOG ===
    story.append(Paragraph("DECISION TIMELINE", header_style))

    decisions = data.get('decisions', [])
    if decisions:
        decision_headers = ['Time', 'Action', 'Reason']
        decision_rows = [decision_headers]

        for decision in decisions[:20]:  # Limit to first 20 decisions
            row = [
                decision.get('createdAt', 'N/A')[:16],
                decision.get('action', 'N/A')[:50],
                decision.get('reason', 'N/A')[:50]
            ]
            decision_rows.append(row)

        decision_table = Table(decision_rows, colWidths=[4*cm, 4*cm, 5*cm])
        decision_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e0e0e0')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [
                colors.white if i % 2 == 0 else colors.HexColor('#f9f9f9')
                for i in range(len(decision_rows) - 1)
            ])
        ]))

        story.append(decision_table)
    else:
        story.append(Paragraph("No decisions recorded during this period.", body_style))

    story.append(Spacer(1, 0.5*cm))

    # === PERFORMANCE ANALYSIS ===
    story.append(Paragraph("PERFORMANCE ANALYSIS", header_style))

    performance = data.get('performance', {})
    if performance:
        metrics_data = [
            ['Average Response Time:', performance.get('avgResponseTime', 'N/A')],
            ['Total Units Deployed:', str(performance.get('unitsDeployed', 0))],
            ['Incidents Resolved:', str(performance.get('incidentsResolved', 0))],
            ['Critical Escalations:', str(performance.get('criticalEscalations', 0))],
            ['Resource Utilization:', performance.get('resourceUtilization', 'N/A')],
            ['Communication Sessions:', str(performance.get('communicationSessions', 0))]
        ]

        metrics_table = Table(metrics_data, colWidths=[5*cm, 5*cm])
        metrics_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e0e0e0'))
        ]))

        story.append(metrics_table)

        # Recommendations
        if performance.get('recommendations'):
            story.append(Spacer(1, 0.3*cm))
            story.append(Paragraph("Recommendations", subheader_style))
            for rec in performance.get('recommendations', []):
                story.append(Paragraph(f"• {rec}", body_style))
    else:
        story.append(Paragraph("No performance metrics available.", body_style))

    story.append(Spacer(1, 0.5*cm))

    # === FOOTER ===
    story.append(PageBreak())

    footer_text = data.get('footer', """
This report is classified for official use by the Directorate General of Civil Protection Algeria.
All data presented in this report is based on operational records and analysis.
Report generated automatically by DGPC Mission Control System.
    """.strip())

    for paragraph in footer_text.split('\n'):
        story.append(Paragraph(paragraph, body_style))

    # Build the PDF
    doc.build(story)

    print(f"Report generated successfully: {output_path}")
    return output_path


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 generate_report.py <input_json> <output_pdf>")
        print("Example: python3 generate_report.py data.json report.pdf")
        sys.exit(1)

    input_json = sys.argv[1]
    output_pdf = sys.argv[2]

    try:
        with open(input_json, 'r') as f:
            data = json.load(f)

        generate_report(data, output_pdf)
    except FileNotFoundError:
        print(f"Error: Input file '{input_json}' not found")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in input file '{input_json}'")
        sys.exit(1)
    except Exception as e:
        print(f"Error generating report: {str(e)}")
        sys.exit(1)
