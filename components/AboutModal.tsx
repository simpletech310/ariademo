'use client'
import React from 'react'

interface AboutModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
            <div
                className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-[#F0EDEA] flex items-center justify-between bg-sage-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sage-600 flex items-center justify-center shadow-lg shadow-sage-600/20">
                            <span className="text-white font-display font-bold text-lg">A</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold text-ink">About Aria</h2>
                            <p className="text-[10px] text-sage-600 font-bold uppercase tracking-widest">Tech Advancement Demo</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ink/30 hover:text-ink hover:shadow-md transition-all border border-[#F0EDEA]"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                    {/* Mission Section */}
                    <section>
                        <h3 className="text-[11px] font-bold text-sage-600 uppercase tracking-[0.2em] mb-4">The Mission</h3>
                        <p className="text- ink text-base leading-relaxed font-medium mb-4">
                            Aria was built to show how <span className="text-sage-700 font-bold">small but strategic advancements in tech</span> can fundamentally transform how organizations serve their communities.
                        </p>
                        <p className="text-ink/60 text-sm leading-relaxed">
                            By combining conversational AI with high-fidelity OCR, Aria eliminates the bottleneck of manual data entry, allowing nonprofits to spend more time on impact and less on paperwork.
                        </p>
                    </section>

                    {/* Tech Stack Section */}
                    <section className="bg-[#F7F3EE]/50 rounded-2xl p-6 border border-[#F0EDEA]">
                        <h3 className="text-[11px] font-bold text-ink/40 uppercase tracking-[0.2em] mb-4">Inside the Tech</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-ink">Cognition</p>
                                <p className="text-[11px] text-ink/50">GPT-4o Reasoning & Form Logic</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-ink">Vision</p>
                                <p className="text-[11px] text-ink/50">OpenAI Vision OCR Pipeline</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-ink">Database</p>
                                <p className="text-[11px] text-ink/50">Supabase Real-time Storage</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-ink">Interface</p>
                                <p className="text-[11px] text-ink/50">Next.js 14 & Tailwind CSS</p>
                            </div>
                        </div>
                    </section>

                    {/* Thomas Section */}
                    <section className="border-t border-[#F0EDEA] pt-10">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-1">
                                <h3 className="text-[11px] font-bold text-sage-600 uppercase tracking-[0.2em] mb-4">Meet the Developer</h3>
                                <h4 className="text-2xl font-display font-bold text-ink mb-1 italic">Thomas</h4>
                                <p className="text-xs text-ink/40 font-bold uppercase tracking-widest mb-4">AI, Cloud & Networking Specialist</p>
                                <p className="text-ink/60 text-sm leading-relaxed mb-6">
                                    With <span className="text-sage-700 font-bold">10+ years of experience</span> across technical infrastructure, networking, and cloud architecture, Thomas specializes in deploying advanced AI/ML solutions that solve real-world operational challenges.
                                </p>

                                <div className="flex items-center gap-4">
                                    <button className="px-6 py-2.5 bg-sage-600 text-white rounded-xl text-xs font-bold hover:bg-sage-700 transition-all shadow-lg shadow-sage-600/20">
                                        Let's Collaborate
                                    </button>
                                    <p className="text-[10px] text-ink/30 italic">Reach out to discuss custom solutions.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#F7F3EE]/30 text-center border-t border-[#F0EDEA]">
                    <p className="text-[9px] font-bold text-ink/20 uppercase tracking-[0.4em]">CareStack Digital Suite — 2026</p>
                </div>
            </div>
        </div>
    )
}
