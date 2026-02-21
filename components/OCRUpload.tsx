import { useState } from 'react'
import { ARIA_SYSTEM_PROMPT } from '@/lib/aria'

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

            if (!res.ok) throw new Error('OCR Failed')
            const data = await res.json()

            // 2. Wrap text for Aria to process
            const prompt = `I've digitized a paper form using OCR. Here is the raw text extracted. Please analyze it and generate a structured digital version of this form.\n\nRAW OCR TEXT:\n${data.raw_text}`

            // We pass this "user-like" prompt message back up
            onResult(prompt)

        } catch (err) {
            setError('Could not process this image. Please try another or a higher-resolution scan.')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F7F3EE]">
            <div className="max-w-md w-full bg-white rounded-2xl border-2 border-dashed border-[#D8D2C8] p-12 text-center">
                <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage-600">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </div>

                <h3 className="text-lg font-display font-semibold text-ink mb-2">Digitize a Paper Form</h3>
                <p className="text-sm text-ink/50 mb-8 leading-relaxed">
                    Upload a clear photo or scan of your existing paper intake form. Aria will transcribe and structure it for you.
                </p>

                <label className={`block w-full py-3 px-4 rounded-xl font-medium text-sm transition-all cursor-pointer ${isUploading ? 'bg-sage-100 text-sage-400 pointer-events-none' : 'bg-sage-600 text-white hover:bg-sage-700'
                    }`}>
                    {isUploading ? 'Extracting text...' : 'Select File (JPG, PNG, PDF)'}
                    <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
                </label>

                {error && <p className="mt-4 text-xs text-red-500">{error}</p>}
            </div>
        </div>
    )
}
