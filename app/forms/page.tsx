'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IntakeForm } from '@/lib/types'

export default function FormsGallery() {
    const [forms, setForms] = useState<IntakeForm[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedForm, setSelectedForm] = useState<IntakeForm | null>(null)
    const [submissions, setSubmissions] = useState<any[]>([])
    const [loadingSubmissions, setLoadingSubmissions] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        async function fetchForms() {
            try {
                const res = await fetch('/api/forms')
                const data = await res.json()
                setForms(data.forms || [])
            } catch (err) {
                console.error('Failed to fetch forms:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchForms()
    }, [])

    const copyLink = (id: string) => {
        const url = `${window.location.origin}/f/${id}`
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const viewSubmissions = async (form: IntakeForm) => {
        setSelectedForm(form)
        setLoadingSubmissions(true)
        try {
            const res = await fetch(`/api/forms/${form.id}/submissions`)
            const data = await res.json()
            setSubmissions(data.submissions || [])
        } catch (err) {
            console.error('Failed to fetch submissions:', err)
        } finally {
            setLoadingSubmissions(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F7F3EE] p-8 md:p-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Link href="/" className="text-sage-600 font-medium text-sm hover:underline flex items-center gap-1 mb-2">
                            ← Back to Chat
                        </Link>
                        <h1 className="text-3xl font-display font-bold text-ink">Saved Intake Forms</h1>
                        <p className="text-ink/50 mt-1">Manage and view the forms Aria has built for you.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex gap-1.5 items-center">
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                        </div>
                    </div>
                ) : forms.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-[#D8D2C8] shadow-sm">
                        <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage-300">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14.5 2 14.5 7.5 20 7.5" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-display font-semibold text-ink mb-2">No forms saved yet</h3>
                        <p className="text-ink/40 max-w-sm mx-auto mb-8">
                            Start a conversation with Aria to build your first intake form or digitize a paper copy.
                        </p>
                        <Link href="/" className="inline-block px-6 py-3 bg-sage-600 text-white rounded-xl font-semibold hover:bg-sage-700 transition-colors">
                            Return to Aria
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map((form) => (
                            <div key={form.id} className="bg-white rounded-2xl p-6 border border-[#D8D2C8] shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                <div className="mb-4">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-sage-500 mb-1">
                                        Form
                                    </div>
                                    <h3 className="font-display font-bold text-ink text-lg leading-snug group-hover:text-sage-700 transition-colors">
                                        {form.title}
                                    </h3>
                                    {form.description && (
                                        <p className="text-xs text-ink/40 mt-1.5 line-clamp-2">
                                            {form.description}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => copyLink(form.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${copiedId === form.id ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-sage-600 text-white hover:bg-sage-700'
                                            }`}
                                    >
                                        {copiedId === form.id ? '✓ Link Copied' : (
                                            <>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                                </svg>
                                                Share Link
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => viewSubmissions(form)}
                                        className="flex-1 py-2 rounded-xl bg-sage-50 text-sage-600 text-xs font-bold hover:bg-sage-100 transition-all border border-sage-100"
                                    >
                                        View History
                                    </button>
                                </div>

                                <div className="mt-6 pt-4 border-t border-[#F0EDEA] flex items-center justify-between">
                                    <span className="text-[10px] font-medium text-ink/30 uppercase tracking-widest">
                                        {form.sections?.length || 0} Sections
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submissions Modal */}
            {selectedForm && (
                <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-8 border-b border-[#F0EDEA] flex items-center justify-between bg-sage-50/50">
                            <div>
                                <h2 className="text-xl font-display font-bold text-ink italic">{selectedForm.title}</h2>
                                <p className="text-xs text-ink/40 uppercase tracking-widest font-bold mt-1">Submission Intake History</p>
                            </div>
                            <button onClick={() => setSelectedForm(null)} className="text-ink/30 hover:text-ink transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            {loadingSubmissions ? (
                                <div className="flex justify-center py-20">
                                    <div className="flex gap-1.5 items-center">
                                        <div className="typing-dot" />
                                        <div className="typing-dot" />
                                        <div className="typing-dot" />
                                    </div>
                                </div>
                            ) : submissions.length === 0 ? (
                                <div className="text-center py-20 bg-[#F7F3EE]/50 rounded-2xl border-2 border-dashed border-[#D8D2C8]">
                                    <p className="text-ink/40 text-sm italic">No entries collected yet. Share the link to start gathering data!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {submissions.map((sub, idx) => (
                                        <div key={sub.id} className="border border-[#D8D2C8] rounded-2xl overflow-hidden bg-white shadow-sm">
                                            <div className="bg-[#F7F3EE] px-6 py-3 border-b border-[#D8D2C8] flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Entry #{submissions.length - idx}</span>
                                                <span className="text-[10px] font-medium text-ink/40">{new Date(sub.submitted_at).toLocaleString()}</span>
                                            </div>
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                                                {Object.entries(sub.data).map(([key, val]) => (
                                                    <div key={key}>
                                                        <p className="text-[10px] text-ink/30 uppercase tracking-widest font-bold mb-1">{key.replace(/_/g, ' ')}</p>
                                                        <p className="text-sm text-ink/80 font-medium">{String(val)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
