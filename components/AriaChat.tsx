'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Message, IntakeForm } from '@/lib/types'
import { extractFormJSON, stripFormJSON } from '@/lib/aria'
import FormPreview from '@/components/FormPreview'
import OCRUpload from '@/components/OCRUpload'
import AboutModal from '@/components/AboutModal'

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  content: "Hi! I'm Aria 👋 I help nonprofits create smart digital intake forms — either by chatting through what you need, or by digitizing a paper form you already have.\n\nTo get started: **what type of organization or program are you building an intake form for?**",
  timestamp: new Date(),
}

type ActiveTab = 'chat' | 'ocr'

export default function AriaChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat')
  const [builtForm, setBuiltForm] = useState<IntakeForm | null>(null)
  const [savingForm, setSavingForm] = useState(false)
  const [savedForms, setSavedForms] = useState<string[]>([])
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = useCallback(async (content?: string) => {
    const text = content || input.trim()
    if (!text || isLoading) return

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const assistantId = uuidv4()
    let fullResponse = ''

    // Add placeholder
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: new Date() },
    ])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!res.ok) throw new Error('Chat request failed')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        fullResponse += decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: fullResponse } : m
          )
        )
      }

      // Check if a form was generated
      const form = extractFormJSON(fullResponse)
      if (form) {
        setBuiltForm(form)
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I ran into an issue. Could you try again?" }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const saveForm = async () => {
    if (!builtForm) return
    setSavingForm(true)
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: builtForm }),
      })
      if (res.ok) {
        setSavedForms((prev) => [...prev, builtForm.id])
      }
    } catch (e) {
      console.error('Save failed:', e)
    } finally {
      setSavingForm(false)
    }
  }

  const handleOCRResult = (ariaResponse: string) => {
    const form = extractFormJSON(ariaResponse)
    if (form) setBuiltForm(form)

    // Add OCR result to chat
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        role: 'assistant',
        content: ariaResponse,
        timestamp: new Date(),
      },
    ])
    setActiveTab('chat')
  }

  const renderMessageContent = (content: string) => {
    const clean = stripFormJSON(content)
    // Simple markdown-lite rendering
    return clean
      .split('\n')
      .map((line, i) => {
        const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return <p key={i} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: bold }} />
      })
  }

  return (
    <div className="flex h-screen bg-[#F7F3EE] font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#D8D2C8] bg-white flex flex-col">
        <div className="p-5 border-b border-[#D8D2C8]">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">A</span>
            </div>
            <div>
              <p className="font-display font-semibold text-ink text-sm">Aria</p>
              <p className="text-[10px] text-ink/40">Intake Agent</p>
            </div>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="p-3 border-b border-[#D8D2C8]">
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${activeTab === 'chat'
              ? 'bg-sage-50 text-sage-700'
              : 'text-ink/50 hover:text-ink hover:bg-[#F7F3EE]'
              }`}
          >
            💬 Build a Form
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ocr'
              ? 'bg-sage-50 text-sage-700'
              : 'text-ink/50 hover:text-ink hover:bg-[#F7F3EE]'
              }`}
          >
            📄 Digitize Paper Form
          </button>
        </div>

        {/* Current form */}
        {builtForm && (
          <div className="p-3 border-b border-[#D8D2C8]">
            <p className="text-[10px] text-ink/40 uppercase tracking-wider mb-2 px-1">Current Form</p>
            <div className="bg-sage-50 border border-sage-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-sage-800 mb-0.5 truncate">{builtForm.title}</p>
              <p className="text-[10px] text-sage-600 mb-2">{builtForm.sections.length} sections</p>
              <button
                onClick={saveForm}
                disabled={savingForm || savedForms.includes(builtForm.id)}
                className="w-full text-xs py-1.5 rounded-md bg-sage-600 text-white font-medium hover:bg-sage-700 transition-colors disabled:opacity-60"
              >
                {savedForms.includes(builtForm.id) ? '✓ Saved' : savingForm ? 'Saving...' : 'Save Form'}
              </button>
            </div>
          </div>
        )}

        {/* Quick prompts */}
        <div className="p-3 flex-1">
          <p className="text-[10px] text-ink/40 uppercase tracking-wider mb-2 px-1">Quick Start</p>
          {[
            'Food pantry client intake',
            'Housing assistance application',
            'Mental health program intake',
            'Volunteer application form',
            'Youth program registration',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(`I need an intake form for a ${prompt.toLowerCase()}`)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-ink/55 hover:text-ink hover:bg-[#F7F3EE] transition-colors mb-0.5"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-[#D8D2C8] space-y-3">
          <button
            onClick={() => setIsAboutOpen(true)}
            className="flex items-center gap-2 text-xs text-ink/40 hover:text-sage-600 transition-colors uppercase tracking-widest font-bold"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Project Info
          </button>
          <a href="/forms" className="block text-xs text-sage-600 hover:underline">→ View all saved forms</a>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'ocr' ? (
          <OCRUpload onResult={handleOCRResult} />
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-enter flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-sage-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-display font-bold">A</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-sage-600 text-white rounded-tr-sm'
                      : 'bg-white border border-[#EDE8E0] text-ink rounded-tl-sm shadow-sm'
                      }`}
                  >
                    {msg.content ? renderMessageContent(msg.content) : (
                      <div className="flex gap-1.5 items-center py-0.5">
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && messages[messages.length - 1]?.content === '' ? null : isLoading && (
                <div className="message-enter flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-sage-600 flex items-center justify-center">
                    <span className="text-white text-xs font-display font-bold">A</span>
                  </div>
                  <div className="bg-white border border-[#EDE8E0] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Form preview panel (inline, collapsible) */}
            {builtForm && (
              <div className="border-t border-[#D8D2C8] bg-white" style={{ maxHeight: '45vh', overflowY: 'auto' }}>
                <div className="px-6 py-3 border-b border-[#EDE8E0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sage-500" />
                    <span className="text-xs font-semibold text-ink">Form Preview — {builtForm.title}</span>
                  </div>
                  <button onClick={() => setBuiltForm(null)} className="text-ink/30 hover:text-ink text-xs transition-colors">✕ dismiss</button>
                </div>
                <div className="px-6 py-4">
                  <FormPreview form={builtForm} compact />
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-[#D8D2C8] bg-white px-4 py-3">
              <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tell Aria what kind of form you need..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-[#D8D2C8] bg-[#F7F3EE] px-4 py-3 text-sm text-ink placeholder-ink/35 focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-all"
                  style={{ minHeight: '46px', maxHeight: '120px' }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700 transition-colors disabled:opacity-40 flex-shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-ink/30 text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </>
        )}
      </div>
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  )
}
