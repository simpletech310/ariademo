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
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea'
    required: boolean
    placeholder?: string
    options?: string[]
}

export interface Section {
    id: string
    title: string
    fields: Field[]
}

export interface IntakeForm {
    id: string
    title: string
    description?: string
    sections: Section[]
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
