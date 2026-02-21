import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Edge runtime for speed, but Node is fine for OCR
export const dynamic = 'force-dynamic'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // OpenAI Vision handles common image formats. 
        // For PDF, we'll need a conversion step (handled by caller or indicated as error)
        if (file.type === 'application/pdf') {
            // We'll return a specific error if it's a PDF for now, 
            // until we add client-side conversion or a PDF-specific parser.
            return NextResponse.json({
                error: 'PDF conversion error. Please upload a photo (JPG/PNG) or wait for PDF support.',
                isPdf: true
            }, { status: 422 })
        }

        const bytes = await file.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a professional OCR assistant. Transcribe ALL text from the provided image of a form. Preserve the structure as much as possible. If there are checkboxes, indicate if they are checked [x] or empty [ ]. Capture every label and the data written near it."
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                "url": `data:${file.type};base64,${base64}`,
                                "detail": "high"
                            },
                        },
                    ],
                },
            ],
            max_tokens: 2000,
        })

        const raw_text = response.choices[0]?.message?.content || ''

        if (!raw_text) {
            throw new Error('No text returned from Vision model')
        }

        return NextResponse.json({
            raw_text,
            fields: [], // Aria will parse fields from raw_text
            confidence_avg: 0.95
        })
    } catch (error: any) {
        console.error('OCR Vision Failure:', error)
        return NextResponse.json({
            error: error.message || 'Failed to process image with Vision model'
        }, { status: 500 })
    }
}
