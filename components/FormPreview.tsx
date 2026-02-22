import { IntakeForm } from '@/lib/types'

interface FormPreviewProps {
    form: IntakeForm
    compact?: boolean
}

export default function FormPreview({ form, compact }: FormPreviewProps) {
    return (
        <div className={`bg-white rounded-xl ${compact ? 'p-0' : 'p-8 shadow-sm border border-[#EDE8E0]'}`}>
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    {form.organizationName && <span className="text-[10px] font-bold text-sage-600 uppercase tracking-widest">{form.organizationName}</span>}
                    {form.programType && <span className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">• {form.programType}</span>}
                </div>
                <h2 className="text-2xl font-display font-semibold text-ink">{form.title}</h2>
                {form.description && <p className="text-sm text-ink/60 mt-1.5 leading-relaxed">{form.description}</p>}
                {form.completedBy && <p className="text-[10px] text-ink/40 mt-2 font-medium">To be completed by: <span className="text-ink/60 uppercase">{form.completedBy}</span></p>}
            </div>

            <div className="space-y-10">
                {form.sections.map((section) => (
                    <div key={section.id}>
                        <div className="mb-5 pb-1 border-b border-sage-100 flex items-baseline justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-sage-600">
                                {section.title}
                            </h3>
                            {section.description && <span className="text-[10px] text-ink/30 italic">{section.description}</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            {section.fields.map((field) => (
                                <div key={field.id} className={`${(field.type === 'textarea' || field.type === 'address' || field.type === 'signature' || field.type === 'scale') ? 'md:col-span-2' : ''} ${field.staffOnly ? 'bg-sage-50/40 p-3 rounded-lg border border-sage-100' : ''}`}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold text-ink/70">
                                            {field.label} {field.required && <span className="text-sage-500">*</span>}
                                        </label>
                                        {field.staffOnly && <span className="text-[9px] font-bold text-sage-500 uppercase tracking-tighter bg-white px-1.5 py-0.5 rounded border border-sage-100">Staff Only</span>}
                                    </div>

                                    {field.helpText && <p className="text-[10px] text-ink/40 mb-2 italic">{field.helpText}</p>}

                                    {field.type === 'select' ? (
                                        <select className="w-full px-3 py-2 bg-[#F7F3EE] border border-[#D8D2C8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-100">
                                            <option value="">Select option...</option>
                                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    ) : field.type === 'textarea' ? (
                                        <textarea
                                            rows={3}
                                            placeholder={field.placeholder}
                                            className="w-full px-3 py-2 bg-[#F7F3EE] border border-[#D8D2C8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-100"
                                        />
                                    ) : field.type === 'radio' || field.type === 'scale' ? (
                                        <div className="flex flex-wrap gap-4 pt-1">
                                            {field.options?.map(opt => (
                                                <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                                    <div className="w-4 h-4 rounded-full border border-[#D8D2C8] bg-white group-hover:border-sage-400 transition-colors" />
                                                    <span className="text-xs text-ink/60">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : field.type === 'checkbox' ? (
                                        <div className="flex flex-wrap gap-4 pt-1">
                                            {field.options?.map(opt => (
                                                <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                                    <div className="w-4 h-4 rounded border border-[#D8D2C8] bg-white group-hover:border-sage-400 transition-colors" />
                                                    <span className="text-xs text-ink/60">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : field.type === 'address' ? (
                                        <div className="space-y-2">
                                            <input type="text" placeholder="Street Address" className="w-full px-3 py-2 bg-[#F7F3EE] border border-[#D8D2C8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-100" />
                                            <div className="grid grid-cols-6 gap-2">
                                                <input type="text" placeholder="City" className="col-span-3 px-3 py-2 bg-[#F7F3EE] border border-[#D8D2C8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-100" />
                                                <input type="text" placeholder="ST" className="col-span-1 px-3 py-2 bg-[#F7F3EE] border border-[#D8D2C8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-100" />
                                                <input type="text" placeholder="ZIP" className="col-span-2 px-3 py-2 bg-[#F7F3EE] border border-[#D8D2C8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-100" />
                                            </div>
                                        </div>
                                    ) : field.type === 'signature' ? (
                                        <div className="w-full h-24 bg-[#F7F3EE] border-2 border-dashed border-[#D8D2C8] rounded-lg flex items-center justify-center">
                                            <p className="text-[10px] text-ink/30 uppercase font-bold tracking-widest">Digital Signature Pad</p>
                                        </div>
                                    ) : field.type === 'file' ? (
                                        <div className="w-full px-4 py-3 bg-white border border-[#D8D2C8] rounded-lg flex items-center justify-between">
                                            <span className="text-xs text-ink/40 italic">No file selected</span>
                                            <button className="text-[10px] font-bold text-sage-600 uppercase tracking-widest px-3 py-1 bg-sage-50 rounded border border-sage-100">Upload</button>
                                        </div>
                                    ) : (
                                        <input
                                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                                            placeholder={field.placeholder}
                                            className="w-full px-3 py-2 bg-[#F7F3EE] border border-[#D8D2C8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-100"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {form.consentBlocks && form.consentBlocks.length > 0 && (
                    <div className="mt-12 space-y-6 pt-10 border-t-2 border-sage-100">
                        {form.consentBlocks.map((block) => (
                            <div key={block.id} className="bg-sage-50/30 p-6 rounded-2xl border border-sage-100">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-3">{block.title}</h4>
                                <div className="text-xs text-ink/60 leading-relaxed space-y-2 mb-4">
                                    {block.body.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border-2 border-sage-200 bg-white group-hover:border-sage-400 transition-colors flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-sage-500 rounded-sm opacity-0 group-hover:opacity-20 transition-opacity" />
                                    </div>
                                    <span className="text-xs font-medium text-ink/70 italic">I have read and agree to the {block.title}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
