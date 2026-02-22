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
                <div className="p-8 border-b border-[#F0EDEA] flex items-center justify-between bg-white relative">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-sage-600 flex items-center justify-center shadow-xl shadow-sage-600/20 rotate-3 transition-transform hover:rotate-0">
                            <span className="text-white font-display font-black text-xl">T</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-black text-ink italic tracking-tight">Meet Thomas</h2>
                            <p className="text-[10px] text-sage-600 font-bold uppercase tracking-[0.2em]">Product leader · Builder · advocate</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-[#F7F3EE] flex items-center justify-center text-ink/30 hover:text-ink hover:bg-sage-100/50 transition-all border border-transparent hover:border-sage-200"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 space-y-12">
                    {/* Headline and Bio */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-sage-600 border-l-4 border-sage-200 pl-4">The Perspective</h3>
                            <p className="text-lg font-display font-bold text-ink leading-snug">
                                AI Product Manager · IT Director · Builder
                            </p>
                        </div>

                        <div className="text-ink/70 text-sm leading-relaxed space-y-4">
                            <p>
                                I've spent <span className="text-ink font-bold">15+ years</span> at the intersection of technology and people — managing 700+ endpoints across 30+ locations, leading digital transformations for organizations that couldn't afford to get it wrong.
                            </p>
                            <p className="text-ink font-medium">
                                But the work I'm most proud of doesn't show up on a service delivery report.
                            </p>
                            <p>
                                I run <span className="text-ink font-bold">Forever Forward</span>, a nonprofit in Los Angeles that serves fathers rebuilding their lives. When I needed a smarter way to manage cases, coordinate resources, and stay connected with clients after hours, I didn't find a tool that fit — so I built one. That's how <span className="text-ink font-bold">CareStack</span> was born.
                            </p>
                        </div>
                    </div>

                    {/* The Agents Section */}
                    <div className="bg-[#FAF9F7] rounded-3xl p-8 border border-[#EDE8E0] space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/30 text-center">The CareStack Suite</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <div className="text-sage-600 font-display font-black text-lg italic">Aria.</div>
                                <p className="text-[11px] text-ink/60 leading-relaxed">Eliminates paper intake bottlenecks with conversational form building and OCR.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sage-600 font-display font-black text-lg italic">Keith.</div>
                                <p className="text-[11px] text-ink/60 leading-relaxed">Connects people in crisis to the right nonprofit on the first try.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sage-600 font-display font-black text-lg italic">Travis.</div>
                                <p className="text-[11px] text-ink/60 leading-relaxed">Gives case managers a 24/7 assistant that actually knows each client's case.</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-ink/40 italic text-center pt-4 border-t border-ink/5">
                            "So no one falls through the cracks at 11pm on a Tuesday."
                        </p>
                    </div>

                    {/* Full Stack View */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                            <div className="md:col-span-3 space-y-4 text-ink/70 text-sm leading-relaxed">
                                <p>
                                    This portfolio is proof of concept. It's also proof of perspective. I bring something most AI builders don't: I've been the IT director troubleshooting infrastructure, the consultant selling the solution, and the nonprofit founder sitting across from someone who needed help.
                                </p>
                                <p className="font-bold text-ink">
                                    That full-stack view of how technology actually gets used — and where it fails — is what I build from.
                                </p>
                            </div>
                            <div className="md:col-span-2 bg-sage-600 p-6 rounded-2xl text-white rotate-1 shadow-xl">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Philosophy</p>
                                <p className="text-sm font-display font-bold italic leading-tight">
                                    "Technology should amplify human potential, not replace it."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="pt-10 border-t border-[#F0EDEA] flex flex-col items-center text-center space-y-6">
                        <p className="text-ink/60 text-sm max-w-md">
                            If you're building something in the nonprofit or human services space and need a product leader who can go from whiteboard to working demo — let's talk.
                        </p>
                        <div className="flex flex-col items-center gap-2">
                            <a
                                href="mailto:wilform.thomas@gmail.com"
                                className="px-10 py-4 bg-sage-600 text-white rounded-2xl font-bold hover:bg-sage-700 transition-all shadow-xl shadow-sage-600/20 active:scale-95"
                            >
                                Reach out → wilform.thomas@gmail.com
                            </a>
                            <p className="text-[10px] text-ink/30 font-bold uppercase tracking-[0.2em]">Los Angeles Metro</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#F7F3EE]/30 text-center border-t border-[#F0EDEA]">
                    <p className="text-[9px] font-bold text-ink/20 uppercase tracking-[0.4em]">CareStack Digital Suite — 2026</p>
                </div>
            </div>
        </div>
    )
}
