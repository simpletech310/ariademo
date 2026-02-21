import { useState } from 'react'

interface OCRUploadProps {
    onResult: (ariaResponse: string) => void
}

export default function OCRUpload({ onResult }: OCRUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setError(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            // 1. Send to OCR backend
            const res = await fetch('/api/ocr', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 422 && data.isPdf) {
                    throw new Error('For PDF files, please upload a clear screenshot or photo of the page for better results. Support for multi-page PDFs is coming soon!')
                }
                throw new Error(data.error || 'Transcription failed')
            }

            // 2. Wrap text for Aria to process
            const prompt = `I've digitized a paper form using OCR. Here is the transcription of the form contents. Please analyze it and generate a structured digital version of this form.\n\nRAW TRANSCRIBED TEXT:\n${data.raw_text}`

            // We pass this "user-like" prompt message back up
            onResult(prompt)

        } catch (err: any) {
            setError(err.message || 'Could not process this file. Please try a high-resolution JPG or PNG photo.')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F7F3EE]">
            <div className="max-w-md w-full bg-white rounded-3xl border border-[#D8D2C8] p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage-600">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </div>

                <h3 className="text-xl font-display font-bold text-ink mb-2 italic">Digitize your paper form</h3>
                <p className="text-sm text-ink/40 mb-10 leading-relaxed px-4">
                    Upload a clear photo or screenshot of your paper intake form. Aria will transcribe it and turn it into a digital version instantly.
                </p>

                <div className="space-y-4">
                    <label className={`block w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-sage-600/10 transition-all cursor-pointer ${isUploading ? 'bg-sage-100 text-sage-400 pointer-events-none' : 'bg-sage-600 text-white hover:bg-sage-700 active:scale-95'
                        }`}>
                        {isUploading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="typing-dot bg-white" />
                                <div className="typing-dot bg-white" />
                                <div className="typing-dot bg-white" />
                            </div>
                        ) : 'Select Photo or Screenshot'}
                        <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
                    </label>

                    <p className="text-[10px] text-ink/20 uppercase tracking-widest font-bold">
                        Supports JPG, PNG & Multi-page Screenshots
                    </p>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                        <p className="text-xs text-red-600 leading-relaxed">{error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
