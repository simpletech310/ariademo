import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const formId = formData.get('formId') as string

        if (!file || !formId) {
            return NextResponse.json({ error: 'Missing file or formId' }, { status: 400 })
        }

        const buffer = await file.arrayBuffer()
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `submissions/${formId}/${fileName}`

        const { data, error } = await supabaseAdmin.storage
            .from('form-attachments')
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Supabase upload error:', error)
            return NextResponse.json({ error: 'Failed to upload to storage' }, { status: 500 })
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('form-attachments')
            .getPublicUrl(filePath)

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileId: data.path
        })
    } catch (err) {
        console.error('File upload API error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
