'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IntakeForm } from '@/lib/types'

export default function FormsGallery() {
    const [forms, setForms] = useState<IntakeForm[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedForm, setSelectedForm] = useState<IntakeForm | null>(null)
    const [submissions, setSubmissions] = useState<any[]>([])
    const [selectedSub, setSelectedSub] = useState<any | null>(null)
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
        setSelectedSub(null)
        setLoadingSubmissions(true)
        try {
            const res = await fetch(`/api/forms/${form.id}/submissions`)
            const data = await res.json()
            const subs = data.submissions || []
            setSubmissions(subs)
            if (subs.length > 0) setSelectedSub(subs[0])
        } catch (err) {
            console.error('Failed to fetch submissions:', err)
        } finally {
            setLoadingSubmissions(false)
        }
    }

    const getFieldLabel = (fieldId: string) => {
        if (!selectedForm) return fieldId
        for (const section of selectedForm.sections) {
            const field = section.fields.find(f => f.id === fieldId)
            if (field) return field.label
        }
        return fieldId.replace(/_/g, ' ')
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
                    <div className="bg-white rounded-3xl w-full max-w-6xl h-[85vh] overflow-hidden flex flex-col shadow-2xl scale-fade-in">
                        {/* Header */}
                        <div className="p-8 border-b border-[#F0EDEA] flex items-center justify-between bg-white relative z-10">
                            <div>
                                <h2 className="text-xl font-display font-bold text-ink italic">{selectedForm.title}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-ink/40 uppercase tracking-widest font-bold">Intake History</span>
                                    <div className="w-1 h-1 rounded-full bg-ink/10" />
                                    <span className="text-[10px] text-sage-500 font-bold uppercase tracking-widest">{submissions.length} {submissions.length === 1 ? 'Entry' : 'Entries'}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedForm(null)}
                                className="w-10 h-10 rounded-full bg-[#F7F3EE] flex items-center justify-center text-ink/30 hover:text-ink hover:bg-[#F0EDEA] transition-all"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Column: List Sidebar */}
                            <div className="w-80 border-r border-[#F0EDEA] bg-[#F7F3EE]/30 flex flex-col">
                                {loadingSubmissions ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="flex gap-1.5">
                                            <div className="typing-dot" />
                                            <div className="typing-dot" />
                                            <div className="typing-dot" />
                                        </div>
                                    </div>
                                ) : submissions.length === 0 ? (
                                    <div className="p-8 text-center mt-20">
                                        <p className="text-xs text-ink/30 italic">No data collected yet.</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto">
                                        {submissions.map((sub, idx) => {
                                            // Try to find a primary name to display
                                            const primaryLabel = sub.data.f1 || sub.data.full_name || sub.data.name || `Entry #${submissions.length - idx}`
                                            const dateStr = new Date(sub.submitted_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
                                            const timeStr = new Date(sub.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            const isActive = selectedSub?.id === sub.id

                                            return (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => setSelectedSub(sub)}
                                                    className={`w-full p-6 text-left border-b border-[#F0EDEA] transition-all relative ${isActive ? 'bg-white shadow-[inset_4px_0_0_0_#A7B8A8]' : 'hover:bg-white/60'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2 mb-2">
                                                        <span className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">Entry #{submissions.length - idx}</span>
                                                        <span className="text-[9px] font-bold text-sage-500 uppercase tracking-widest">{dateStr}</span>
                                                    </div>
                                                    <h4 className={`font-display font-bold text-sm truncate ${isActive ? 'text-sage-700' : 'text-ink'}`}>
                                                        {primaryLabel}
                                                    </h4>
                                                    <p className="text-[10px] text-ink/40 mt-1">{timeStr}</p>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Detail Panel */}
                            <div className="flex-1 bg-white overflow-y-auto detail-panel">
                                {selectedSub ? (
                                    <div className="p-12 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="mb-12 border-l-4 border-sage-500 pl-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="px-2 py-0.5 bg-sage-50 text-sage-600 text-[9px] font-bold uppercase tracking-widest rounded-md border border-sage-100">Verified Submission</div>
                                                <span className="text-[10px] text-ink/30 font-medium">{new Date(selectedSub.submitted_at).toLocaleString()}</span>
                                            </div>
                                            <h3 className="text-3xl font-display font-bold text-ink italic">Review Entry</h3>
                                        </div>

                                        <div className="space-y-12">
                                            {selectedForm.sections.map((section) => {
                                                const sectionData = section.fields.filter(f => selectedSub.data[f.id])
                                                if (sectionData.length === 0) return null

                                                return (
                                                    <div key={section.id}>
                                                        <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage-600 mb-6 flex items-center gap-4">
                                                            <span>{section.title}</span>
                                                            <div className="flex-1 h-px bg-sage-50" />
                                                        </h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                                            {section.fields.map((field) => {
                                                                const val = selectedSub.data[field.id]
                                                                if (!val && val !== 0) return null
                                                                return (
                                                                    <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                                                        <p className="text-[10px] text-ink/30 uppercase tracking-widest font-bold mb-2">{field.label}</p>
                                                                        <p className="text-sm text-ink/80 font-medium leading-relaxed bg-[#F7F3EE]/30 p-3 rounded-lg border border-[#F0EDEA]">
                                                                            {String(val)}
                                                                        </p>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="mt-20 pt-10 border-t border-[#F0EDEA] text-center">
                                            <button
                                                onClick={() => window.print()}
                                                className="inline-flex items-center gap-2 text-xs font-bold text-ink/30 hover:text-sage-600 transition-colors uppercase tracking-widest"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="6 9 6 2 18 2 18 9" />
                                                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                                    <rect x="6" y="14" width="12" height="8" />
                                                </svg>
                                                Print Submission
                                            </button>
                                        </div>
                                    </div>
                                ) : submissions.length > 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-40">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-6 text-sage-300">
                                            <path d="M15 15h.01m-3.01 0h.01m-3.01 0h.01M3 21h18M3 7h18M5 7v14M19 7v14" />
                                        </svg>
                                        <p className="text-sm font-medium text-ink italic">Select an entry from the sidebar to view full details.</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
