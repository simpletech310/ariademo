'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IntakeForm } from '@/lib/types'

export default function FormsGallery() {
    const [forms, setForms] = useState<IntakeForm[]>([])
    const [loading, setLoading] = useState(true)

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

                                <div className="mt-auto pt-6 border-t border-[#F0EDEA] flex items-center justify-between">
                                    <span className="text-[10px] font-medium text-ink/30">
                                        {form.sections?.length || 0} Sections
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-lg hover:bg-sage-50 text-ink/40 hover:text-sage-600 transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-red-50 text-ink/40 hover:text-red-500 transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                <line x1="10" y1="11" x2="10" y2="17" />
                                                <line x1="14" y1="11" x2="14" y2="17" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
