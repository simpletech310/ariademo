import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ARIA_SYSTEM_PROMPT } from '@/lib/aria'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Set the runtime to edge for best performance
export const runtime = 'edge'

export async function POST(req: Request) {
    const { messages } = await req.json()

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        stream: true,
        messages: [
            { role: 'system', content: ARIA_SYSTEM_PROMPT },
            ...messages,
        ],
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)
    // Respond with the stream
    return new StreamingTextResponse(stream)
}
