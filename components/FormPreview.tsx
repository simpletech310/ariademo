import { IntakeForm } from '@/lib/types'

interface FormPreviewProps {
    form: IntakeForm
    compact?: boolean
}

export default function FormPreview({ form, compact }: FormPreviewProps) {
    return (
        <div className={`bg-white rounded-xl ${compact ? 'p-0' : 'p-8 shadow-sm border border-[#EDE8E0]'}`}>
            <div className="mb-6">
                <h2 className="text-xl font-display font-semibold text-ink">{form.title}</h2>
                {form.description && <p className="text-sm text-ink/60 mt-1">{form.description}</p>}
            </div>

            <div className="space-y-8">
                {form.sections.map((section) => (
                    <div key={section.id}>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sage-600 mb-4 pb-1 border-b border-sage-100">
                            {section.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.fields.map((field) => (
                                <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                    <label className="block text-xs font-medium text-ink/70 mb-1.5">
                                        {field.label} {field.required && <span className="text-red-400">*</span>}
                                    </label>

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
                                    ) : (
                                        <input
                                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                            placeholder={field.placeholder}
                                            className="w-full px-3 py-2 bg-[#F7F3EE] border border-[#D8D2C8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-100"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
