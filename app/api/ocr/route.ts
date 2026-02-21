import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const files = formData.getAll('file') as File[]

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 })
        }

        const imageContent: any[] = []

        for (const file of files) {
            if (file.type === 'application/pdf') {
                return NextResponse.json({
                    error: 'PDF conversion error. Please upload photos (JPG/PNG) or screenshots of each page.',
                    isPdf: true
                }, { status: 422 })
            }

            const bytes = await file.arrayBuffer()
            const base64 = Buffer.from(bytes).toString('base64')

            imageContent.push({
                type: "image_url",
                image_url: {
                    "url": `data:${file.type};base64,${base64}`,
                    "detail": "high"
                },
            })
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a professional OCR assistant. Transcribe ALL text from the provided images of a form. These images represent pages of a single form. Preserve the structure as much as possible. If there are checkboxes, indicate if they are checked [x] or empty [ ]. Capture every label and the data written near it. Consolidate everything into a coherent transcription."
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Please transcribe these ${files.length} images of a form.`
                        },
                        ...imageContent
                    ],
                },
            ],
            max_tokens: 4000,
        })

        const raw_text = response.choices[0]?.message?.content || ''

        if (!raw_text) {
            throw new Error('No text returned from Vision model')
        }

        return NextResponse.json({
            raw_text,
            fields: [],
            confidence_avg: 0.95
        })
    } catch (error: any) {
        console.error('OCR Vision Failure:', error)
        return NextResponse.json({
            error: error.message || 'Failed to process images with Vision model'
        }, { status: 500 })
    }
}
