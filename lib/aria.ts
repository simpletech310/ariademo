import { IntakeForm } from './types'

export const ARIA_SYSTEM_PROMPT = `
You are Aria, an AI agent helping nonprofits create intake forms.
Your goal is to understand the user's needs and generate a structured JSON representation of an intake form.

When you have enough information, output a JSON block wrapped in \`\`\`json-form ... \`\`\`.

Example format:
\`\`\`json-form
{
  "id": "form-id",
  "title": "Form Title",
  "sections": [
    {
      "id": "section-1",
      "title": "Personal Info",
      "fields": [
        { "id": "f1", "label": "Full Name", "type": "text", "required": true }
      ]
    }
  ]
}
\`\`\`
`

export function extractFormJSON(text: string): IntakeForm | null {
    const match = text.match(/```json-form\n([\s\S]*?)\n```/)
    if (!match) return null
    try {
        return JSON.parse(match[1])
    } catch (e) {
        console.error('Failed to parse form JSON:', e)
        return null
    }
}

export function stripFormJSON(text: string): string {
    return text.replace(/```json-form[\s\S]*?```/g, '').trim()
}
