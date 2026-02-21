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

    // Stream raw text chunks instead of using the AI SDK protocol
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of response) {
                    const text = chunk.choices[0]?.delta?.content || ''
                    if (text) {
                        controller.enqueue(encoder.encode(text))
                    }
                }
                controller.close()
            } catch (err) {
                controller.error(err)
            }
        },
    })

    return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
}
