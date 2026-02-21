import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('intake_forms')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch forms failed:', error)
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 })
  }

  return NextResponse.json({ forms: data ?? [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const form = body?.form

  if (!form?.title || !Array.isArray(form?.sections)) {
    return NextResponse.json({ error: 'Invalid form payload' }, { status: 400 })
  }

  const payload = {
    title: form.title,
    description: form.description ?? null,
    sections: form.sections,
    status: 'draft',
  }

  const { data, error } = await supabaseAdmin
    .from('intake_forms')
    .insert(payload)
    .select('id,title,created_at')
    .single()

  if (error) {
    console.error('Save form failed:', error)
    return NextResponse.json({ error: 'Failed to save form' }, { status: 500 })
  }

  return NextResponse.json({ form: data }, { status: 201 })
}
