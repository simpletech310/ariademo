import os
import shutil
import subprocess

base_path = "/Users/tj/Downloads/Aria_CareStack"
app_path = os.path.join(base_path, "app")

def clean_and_recreate():
    # Paths to clean
    paths_to_clean = [
        os.path.join(app_path, "f"),
        os.path.join(app_path, "api", "forms")
    ]
    
    for p in paths_to_clean:
        if os.path.exists(p):
            # Move out any files we want to keep (like forms/route.ts)
            if p == os.path.join(app_path, "api", "forms"):
                safe_file = os.path.join(p, "route.ts")
                if os.path.exists(safe_file):
                    shutil.move(safe_file, os.path.join(app_path, "api", "forms_route_tmp.ts"))
            
            # Delete EVERYTHING in these folders in git
            # We want to be VERY aggressive
            subprocess.run(["git", "rm", "-rf", p], cwd=base_path)
            # And locally
            shutil.rmtree(p, ignore_errors=True)
            os.makedirs(p, exist_ok=True)

    # Restore api/forms/route.ts
    tmp_file = os.path.join(app_path, "api", "forms_route_tmp.ts")
    if os.path.exists(tmp_file):
        shutil.move(tmp_file, os.path.join(app_path, "api", "forms", "route.ts"))

    # Create correct directories
    f_id_path = os.path.join(app_path, "f", "[id]")
    api_id_path = os.path.join(app_path, "api", "forms", "[id]")
    api_sub_path = os.path.join(api_id_path, "submissions")
    
    os.makedirs(f_id_path, exist_ok=True)
    os.makedirs(api_id_path, exist_ok=True)
    os.makedirs(api_sub_path, exist_ok=True)
    
    # Write files
    with open(os.path.join(f_id_path, "page.tsx"), "w") as f:
        f.write("'use client'\nimport { useState, useEffect } from 'react'\nimport { useParams } from 'next/navigation'\nimport { IntakeForm } from '@/lib/types'\n\nexport default function PublicForm() {\n  const params = useParams()\n  const [form, setForm] = useState<IntakeForm | null>(null)\n  const [formData, setFormData] = useState<Record<string, any>>({})\n  const [loading, setLoading] = useState(true)\n  const [submitting, setSubmitting] = useState(false)\n  const [submitted, setSubmitted] = useState(false)\n  const [error, setError] = useState<string | null>(null)\n\n  useEffect(() => {\n    async function fetchForm() {\n      if (!params.id) return\n      try {\n        const res = await fetch(`/api/forms/${params.id}`)\n        if (!res.ok) throw new Error('Form not found')\n        const data = await res.json()\n        setForm(data.form)\n      } catch (err) {\n        setError('This form is no longer available or could not be found.')\n      } finally {\n        setLoading(false)\n      }\n    }\n    fetchForm()\n  }, [params.id])\n\n  const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault()\n    setSubmitting(true)\n    setError(null)\n\n    try {\n      const res = await fetch('/api/submissions', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          formId: params.id,\n          data: formData\n        })\n      })\n\n      if (!res.ok) throw new Error('Failed to submit')\n      setSubmitted(true)\n    } catch (err) {\n      setError('Something went wrong during submission. Please check your connection and try again.')\n    } finally {\n      setSubmitting(false)\n    }\n  }\n\n  const handleInputChange = (fieldId: string, value: any) => {\n    setFormData(prev => ({ ...prev, [fieldId]: value }))\n  }\n\n  if (loading) return (\n    <div className=\"min-h-screen bg-[#F7F3EE] flex items-center justify-center\">\n      <div className=\"flex gap-1.5 items-center\">\n        <div className=\"typing-dot\" />\n        <div className=\"typing-dot\" />\n        <div className=\"typing-dot\" />\n      </div>\n    </div>\n  )\n\n  if (error || !form) return (\n    <div className=\"min-h-screen bg-[#F7F3EE] flex items-center justify-center p-6 text-center\">\n      <div className=\"max-w-md\">\n        <h1 className=\"text-2xl font-display font-bold text-ink mb-4 italic text-ink/30\">Form Unavailable</h1>\n        <p className=\"text-ink/60 mb-8\">{error || 'This form could not be loaded.'}</p>\n        <a href=\"https://ariademo.vercel.app\" className=\"text-sage-600 hover:underline font-medium\">Build your own form with Aria →</a>\n      </div>\n    </div>\n  )\n\n  if (submitted) return (\n    <div className=\"min-h-screen bg-[#F7F3EE] flex items-center justify-center p-6 text-center\">\n      <div className=\"max-w-md bg-white rounded-3xl p-12 border border-[#D8D2C8] shadow-sm\">\n        <div className=\"w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6\">\n          <svg width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"3\" className=\"text-sage-600\">\n            <polyline points=\"20 6 9 17 4 12\" />\n          </svg>\n        </div>\n        <h1 className=\"text-2xl font-display font-bold text-ink mb-2 italic\">Submission Received</h1>\n        <p className=\"text-ink/60 mb-0\">Your information has been successfully submitted to {form.title}.</p>\n      </div>\n    </div>\n  )\n\n  return (\n    <div className=\"min-h-screen bg-[#F7F3EE] py-12 px-6\">\n      <div className=\"max-w-3xl mx-auto\">\n        <div className=\"bg-white rounded-3xl overflow-hidden border border-[#D8D2C8] shadow-sm\">\n          <div className=\"bg-sage-600 p-8 pb-12 text-white\">\n            <div className=\"w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6\">\n              <span className=\"font-display font-bold\">A</span>\n            </div>\n            <h1 className=\"text-3xl font-display font-bold mb-2 italic\">{form.title}</h1>\n            {form.description && <p className=\"text-white/80 leading-relaxed\">{form.description}</p>}\n          </div>\n\n          <form onSubmit={handleSubmit} className=\"p-8 space-y-12 -mt-6 bg-white rounded-t-3xl border-t border-[#F0EDEA]\">\n            {form.sections.map((section) => (\n              <div key={section.id}>\n                <h3 className=\"text-xs font-bold uppercase tracking-widest text-sage-500 mb-6 border-b border-sage-50 pb-2\">\n                  {section.title}\n                </h3>\n                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">\n                  {section.fields.map((field) => (\n                    <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>\n                      <label className=\"block text-xs font-semibold text-ink/70 mb-2 px-1\">\n                        {field.label} {field.required && <span className=\"text-red-400\">*</span>}\n                      </label>\n                      \n                      {field.type === 'select' ? (\n                        <select \n                          required={field.required}\n                          value={formData[field.id] || ''}\n                          onChange={(e) => handleInputChange(field.id, e.target.value)}\n                          className=\"w-full px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all cursor-pointer\"\n                        >\n                          <option value=\"\">Select option...</option>\n                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}\n                        </select>\n                      ) : field.type === 'textarea' ? (\n                        <textarea \n                          rows={4}\n                          required={field.required}\n                          placeholder={field.placeholder}\n                          value={formData[field.id] || ''}\n                          onChange={(e) => handleInputChange(field.id, e.target.value)}\n                          className=\"w-full px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all\"\n                        />\n                      ) : (\n                        <input \n                          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}\n                          required={field.required}\n                          placeholder={field.placeholder}\n                          value={formData[field.id] || ''}\n                          onChange={(e) => handleInputChange(field.id, e.target.value)}\n                          className=\"w-full px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all\"\n                        />\n                      )}\n                    </div>\n                  ))}\n                </div>\n              </div>\n            ))}\n\n            <div className=\"pt-8 border-t border-[#F0EDEA]\">\n              <button\n                type=\"submit\"\n                disabled={submitting}\n                className=\"w-full py-4 bg-sage-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sage-700 transition-all shadow-lg shadow-sage-600/10 disabled:opacity-60\"\n              >\n                {submitting ? 'Submitting...' : 'Complete Intake'}\n                <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2.5\">\n                  <line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\" />\n                  <polyline points=\"12 5 19 12 12 19\" />\n                </svg>\n              </button>\n            </div>\n          </form>\n        </div>\n        <p className=\"mt-8 text-center text-ink/20 text-[10px] uppercase tracking-widest font-bold\">\n          Powered by Aria & CareStack\n        </p>\n      </div>\n    </div>\n  )\n}\n")

    api_content = "import { NextRequest, NextResponse } from 'next/server'\nimport { supabaseAdmin } from '@/lib/supabase'\n\nexport const dynamic = 'force-dynamic'\n\nexport async function GET(\n  req: NextRequest,\n  { params }: { params: { id: string } }\n) {\n  const { id } = params\n\n  try {\n    const { data: form, error } = await supabaseAdmin\n      .from('intake_forms')\n      .select('*')\n      .eq('id', id)\n      .single()\n\n    if (error || !form) {\n      return NextResponse.json({ error: 'Form not found' }, { status: 404 })\n    }\n\n    return NextResponse.json({ form })\n  } catch (err) {\n    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })\n  }\n}\n"
    with open(os.path.join(api_id_path, "route.ts"), "w") as f:
        f.write(api_content)
        
    sub_content = "import { NextRequest, NextResponse } from 'next/server'\nimport { supabaseAdmin } from '@/lib/supabase'\n\nexport const dynamic = 'force-dynamic'\n\nexport async function GET(\n  req: NextRequest,\n  { params }: { params: { id: string } }\n) {\n  const { id } = params\n\n  try {\n    const { data: submissions, error } = await supabaseAdmin\n      .from('form_submissions')\n      .select('*')\n      .eq('form_id', id)\n      .order('submitted_at', { ascending: false })\n\n    if (error) {\n      return NextResponse.json({ error: error.message }, { status: 500 })\n    }\n\n    return NextResponse.json({ submissions })\n  } catch (err) {\n    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })\n  }\n}\n"
    with open(os.path.join(api_sub_path, "route.ts"), "w") as f:
        f.write(sub_content)

    # Git add and commit
    subprocess.run(["git", "add", "."], cwd=base_path)
    subprocess.run(["git", "commit", "-m", "Fix Vercel build: Python-powered surgical dynamic route fix"], cwd=base_path)
    subprocess.run(["git", "push", "origin", "main"], cwd=base_path)
    
    # Final check
    res = subprocess.run(["git", "ls-files", "app/api/forms", "app/f"], capture_output=True, text=True, cwd=base_path)
    print("FINAL GIT FILES:")
    print(res.stdout)

if __name__ == "__main__":
    clean_and_recreate()
