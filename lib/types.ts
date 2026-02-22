export type Role = 'user' | 'assistant'

export interface Message {
    id: string
    role: Role
    content: string
    timestamp: Date
}

export interface Field {
    id: string
    label: string
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'email' | 'phone' | 'file' | 'signature' | 'address' | 'scale'
    required: boolean
    placeholder?: string
    options?: string[]
    helpText?: string
    validation?: {
        min?: number
        max?: number
        pattern?: string
    }
    staffOnly?: boolean
    fieldReason?: string
}

export interface Section {
    id: string
    title: string
    description?: string
    fields: Field[]
}

export interface ConsentBlock {
    id: string
    title: string
    body: string
    signatureFieldId?: string
}

export interface IntakeForm {
    id: string
    title: string
    description?: string
    organizationName?: string
    programType?: string
    completedBy?: 'client' | 'staff' | 'both'
    sections: Section[]
    consentBlocks?: ConsentBlock[]
}

export interface OCRResult {
    raw_text: string
    fields: {
        label: string
        value: string
        confidence: number
    }[]
    line_count: number
    confidence_avg: number
}
