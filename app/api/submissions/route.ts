import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const { formId, data } = await req.json()

        if (!formId || !data) {
            return NextResponse.json({ error: 'Missing formId or submission data' }, { status: 400 })
        }

        // Insert submission
        const { data: submission, error } = await supabaseAdmin
            .from('form_submissions')
            .insert({
                form_id: formId,
                data: data,
            })
            .select()
            .single()

        if (error) {
            console.error('Submission failed:', error)
            return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
        }

        return NextResponse.json({ success: true, submission })
    } catch (err) {
        console.error('Submission API error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
