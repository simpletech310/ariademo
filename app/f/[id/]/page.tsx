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
        if (params.id) fetchForm()
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
                    <div className="bg-sage-600 p-8 pb-12 text-white">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6">
                            <span className="font-display font-bold">A</span>
                        </div>
                        <h1 className="text-3xl font-display font-bold mb-2 italic">{form.title}</h1>
                        {form.description && <p className="text-white/80 leading-relaxed">{form.description}</p>}
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-12 -mt-6 bg-white rounded-t-3xl border-t border-[#F0EDEA]">
                        {form.sections.map((section) => (
                            <div key={section.id}>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-6 border-b border-sage-50 pb-2">
                                    {section.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {section.fields.map((field) => (
                                        <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <label className="block text-xs font-semibold text-ink/70 mb-2 px-1">
                                                {field.label} {field.required && <span className="text-red-400">*</span>}
                                            </label>

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
                                            ) : (
                                                <input
                                                    type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                                    required={field.required}
                                                    placeholder={field.placeholder}
                                                    value={formData[field.id] || ''}
                                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#F7F3EE] border border-[#D8D2C8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

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
