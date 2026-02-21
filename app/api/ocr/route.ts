import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ocrServiceUrl = process.env.OCR_SERVICE_URL || 'http://localhost:8001'

    try {
        const backendFormData = new FormData()
        backendFormData.append('file', file)

        const res = await fetch(`${ocrServiceUrl}/ocr`, {
            method: 'POST',
            body: backendFormData,
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('OCR backend error:', errorText)
            return NextResponse.json({ error: 'OCR Service error' }, { status: 500 })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('OCR Proxy failed:', error)
        return NextResponse.json({ error: 'Could not reach OCR service' }, { status: 500 })
    }
}
