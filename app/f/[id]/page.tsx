'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { IntakeForm } from '@/lib/types'

export default function PublicForm() {
  const params = useParams()
  const [form, setForm] = useState<IntakeForm | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchForm() {
      if (!params.id) return
      try {
        const res = await fetch(`/api/forms/${params.id}`)
        if (!res.ok) throw new Error('Form not found')
        const data = await res.json()
        setForm(data.form)
      } catch (err) {
        setError('This form is no longer available or could not be found.')
      } finally {
        setLoading(false)
      }
    }
    fetchForm()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: params.id,
          data: formData
        })
      })

      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong during submission. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center">
      <div className="flex gap-1.5 items-center">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  )

  if (error || !form) return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-display font-bold text-ink mb-4 italic text-ink/30">Form Unavailable</h1>
        <p className="text-ink/60 mb-8">{error || 'This form could not be loaded.'}</p>
        <a href="https://ariademo.vercel.app" className="text-sage-600 hover:underline font-medium">Build your own form with Aria →</a>
      </div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white rounded-3xl p-12 border border-[#D8D2C8] shadow-sm">
        <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-sage-600">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-display font-bold text-ink mb-2 italic">Submission Received</h1>
        <p className="text-ink/60 mb-0">Your information has been successfully submitted to {form.title}.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F7F3EE] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl overflow-hidden border border-[#D8D2C8] shadow-sm">
          <div className="bg-sage-600 p-10 pb-14 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-2 py-1 rounded bg-white/20 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">
                  Official Intake
                </div>
                {form.organizationName && (
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{form.organizationName}</span>
                )}
              </div>
              <h1 className="text-4xl font-display font-bold mb-3 italic tracking-tight">{form.title}</h1>
              {form.description && <p className="text-white/80 leading-relaxed max-w-xl text-sm">{form.description}</p>}
              {form.programType && (
                <div className="mt-4 flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                  {form.programType} Program
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12 -mt-6 bg-white rounded-t-3xl border-t border-[#F0EDEA]">
            {form.sections.map((section) => (
              <div key={section.id}>
                <div className="mb-6 flex items-baseline justify-between border-b border-sage-50 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-sage-600">
                    {section.title}
                  </h3>
                  {section.description && <span className="text-[10px] text-ink/30 italic">{section.description}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                  {section.fields.filter(f => !f.staffOnly).map((field) => (
                    <div key={field.id} className={(field.type === 'textarea' || field.type === 'address' || field.type === 'signature' || field.type === 'scale') ? 'md:col-span-2' : ''}>
                      <label className="block text-[11px] font-bold text-ink/70 mb-2 px-1 uppercase tracking-wider">
                        {field.label} {field.required && <span className="text-sage-500">*</span>}
                      </label>

                      {field.helpText && <p className="text-[10px] text-ink/40 mb-3 px-1 italic">{field.helpText}</p>}

                      {field.type === 'select' ? (
                        <select
                          required={field.required}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all cursor-pointer"
                        >
                          <option value="">Select option...</option>
                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          rows={4}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all"
                        />
                      ) : field.type === 'radio' || field.type === 'scale' ? (
                        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1 px-1">
                          {field.options?.map(opt => (
                            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="radio"
                                name={field.id}
                                required={field.required}
                                checked={formData[field.id] === opt}
                                onChange={() => handleInputChange(field.id, opt)}
                                className="w-4 h-4 text-sage-600 border-[#D8D2C8] focus:ring-sage-500 cursor-pointer"
                              />
                              <span className="text-sm text-ink/60 group-hover:text-ink transition-colors">{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1 px-1">
                          {field.options?.map(opt => (
                            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={(formData[field.id] || []).includes(opt)}
                                onChange={(e) => {
                                  const current = formData[field.id] || []
                                  const next = e.target.checked
                                    ? [...current, opt]
                                    : current.filter((v: string) => v !== opt)
                                  handleInputChange(field.id, next)
                                }}
                                className="w-4 h-4 rounded text-sage-600 border-[#D8D2C8] focus:ring-sage-500 cursor-pointer"
                              />
                              <span className="text-sm text-ink/60 group-hover:text-ink transition-colors">{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : field.type === 'address' ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Street Address"
                            required={field.required}
                            value={formData[field.id]?.street || ''}
                            onChange={(e) => handleInputChange(field.id, { ...formData[field.id], street: e.target.value })}
                            className="w-full px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100"
                          />
                          <div className="grid grid-cols-6 gap-3">
                            <input
                              type="text"
                              placeholder="City"
                              required={field.required}
                              value={formData[field.id]?.city || ''}
                              onChange={(e) => handleInputChange(field.id, { ...formData[field.id], city: e.target.value })}
                              className="col-span-3 px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100"
                            />
                            <input
                              type="text"
                              placeholder="ST"
                              required={field.required}
                              maxLength={2}
                              value={formData[field.id]?.state || ''}
                              onChange={(e) => handleInputChange(field.id, { ...formData[field.id], state: e.target.value.toUpperCase() })}
                              className="col-span-1 px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100"
                            />
                            <input
                              type="text"
                              placeholder="ZIP"
                              required={field.required}
                              value={formData[field.id]?.zip || ''}
                              onChange={(e) => handleInputChange(field.id, { ...formData[field.id], zip: e.target.value })}
                              className="col-span-2 px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100"
                            />
                          </div>
                        </div>
                      ) : field.type === 'signature' ? (
                        <div className="space-y-3">
                          <div className="w-full h-32 bg-[#F7F3EE] border-2 border-dashed border-[#D8D2C8] rounded-xl flex flex-col items-center justify-center p-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink/20 mb-2">
                              <path d="M4 20h16M7 16l-3 3 3-3zM17 4l3 3L7 20l-3-3L17 4z" />
                            </svg>
                            <p className="text-[10px] text-ink/30 uppercase font-black tracking-[0.2em]">Signature Pad Implementation Pending</p>
                            <p className="text-[10px] text-ink/40 mt-1">Please type your full name below as a digital signature</p>
                          </div>
                          <input
                            type="text"
                            required={field.required}
                            placeholder="Type full name to sign"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-[#D8D2C8] rounded-xl text-sm italic font-display focus:outline-none focus:ring-2 focus:ring-sage-100"
                          />
                        </div>
                      ) : field.type === 'file' ? (
                        <div className="w-full px-4 py-6 bg-sage-50/30 border-2 border-dashed border-[#D8D2C8] rounded-xl flex flex-col items-center gap-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage-400">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                          </svg>
                          <p className="text-[10px] text-ink/40 font-bold uppercase tracking-wider">Storage Integration Required</p>
                          <span className="text-[10px] text-sage-600/60 font-medium">Click to select files (Disabled)</span>
                        </div>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all font-medium"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {form.consentBlocks && form.consentBlocks.length > 0 && (
              <div className="pt-10 border-t-2 border-sage-50 space-y-8">
                {form.consentBlocks.map((block) => (
                  <div key={block.id} className="bg-[#FAF9F7] p-8 rounded-2xl border border-[#EDE8E0] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-sage-200" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-sage-600 mb-4">{block.title}</h4>
                    <div className="text-xs text-ink/70 leading-relaxed space-y-3 mb-6">
                      {block.body.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          required
                          checked={!!formData[block.id]}
                          onChange={(e) => handleInputChange(block.id, e.target.checked)}
                          className="w-5 h-5 rounded-lg border-2 border-sage-200 text-sage-600 focus:ring-sage-500 cursor-pointer transition-all"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-ink/50 uppercase tracking-widest group-hover:text-sage-600 transition-colors italic">
                        I acknowledge and agree to the {block.title}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-8 border-t border-[#F0EDEA]">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-sage-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sage-700 transition-all shadow-lg shadow-sage-600/10 disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Complete Intake'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </form>
        </div>
        <p className="mt-8 text-center text-ink/20 text-[10px] uppercase tracking-widest font-bold">
          Powered by Aria & CareStack
        </p>
      </div>
    </div>
  )
}
