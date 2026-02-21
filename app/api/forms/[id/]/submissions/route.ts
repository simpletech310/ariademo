import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params

    try {
        const { data: submissions, error } = await supabaseAdmin
            .from('form_submissions')
            .select('*')
            .eq('form_id', id)
            .order('submitted_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ submissions })
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
