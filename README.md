# Aria — AI Intake Agent 🌿

Part of the **CareStack** nonprofit AI suite. Aria creates digital intake forms through conversation, digitizes paper forms with OCR, and keeps every submission organized.

---

## What Aria Does

| Feature | Description |
|---|---|
| **Conversational Form Builder** | Chat with Aria → she asks questions → generates a complete intake form |
| **OCR Digitization** | Upload a photo of a paper form → PaddleOCR extracts text → Aria structures it |
| **Form Management** | All forms saved to Supabase, shareable, trackable |

---

## Stack

- **Next.js 14** (App Router, TypeScript)
- **OpenAI GPT-4o** — Aria's brain (fast + affordable)
- **PaddleOCR** — open-source OCR (runs locally via Python FastAPI)
- **Supabase** — forms + submissions storage (free tier)
- **Tailwind CSS** — styling with custom Aria design system

---

## Quick Start

### 1. Clone & Install

```bash
cd aria-app
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your keys:
- `OPENAI_API_KEY` — from [platform.openai.com](https://platform.openai.com)
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase → Settings → API

### 3. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`

### 4. Start the OCR microservice

```bash
cd ocr-service

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies (PaddleOCR will download models on first run ~500MB)
pip install -r requirements.txt

# Start the service
uvicorn main:app --port 8001 --reload
```

### 5. Start Next.js

```bash
# In a separate terminal, from aria-app/
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
aria-app/
├── app/
│   ├── page.tsx              # Landing page
│   ├── aria/page.tsx         # Main Aria interface
│   ├── forms/page.tsx        # Form management
│   └── api/
│       ├── chat/route.ts     # OpenAI streaming API
│       ├── ocr/route.ts      # OCR pipeline
│       └── forms/route.ts    # Form CRUD
├── components/
│   ├── AriaChat.tsx          # Main chat interface
│   ├── FormPreview.tsx       # Form renderer
│   └── OCRUpload.tsx         # Drag-and-drop OCR
├── lib/
│   ├── aria.ts               # System prompt + form parsing
│   ├── types.ts              # TypeScript interfaces
│   └── supabase.ts           # Supabase client
├── ocr-service/
│   ├── main.py               # FastAPI + PaddleOCR
│   └── requirements.txt
└── supabase-schema.sql       # DB schema
```

---

## How Aria Builds Forms

1. User tells Aria their org type and program
2. Aria asks about who fills the form and what data is needed
3. Once Aria has enough info, she outputs a `form-json` block
4. The frontend parses this JSON into a live form preview
5. User saves → form stored in Supabase

## OCR Pipeline

1. User uploads image via drag-and-drop
2. Next.js API route forwards to Python FastAPI service
3. PaddleOCR runs text extraction with angle correction
4. Raw text + parsed fields returned
5. Aria receives the raw text and structures it into `form-json`
6. Form appears in chat + can be saved

---

## Customization

- **Change the AI model**: Edit `app/api/chat/route.ts` — swap `gpt-4o` for `gpt-4o-mini` for a more cost-effective option.
- **Add OCR languages**: Edit `ocr-service/main.py` → change `lang='en'` to `lang='ch'`, `'fr'`, etc.
- **Extend form field types**: Add to `FieldType` in `lib/types.ts` and `FieldInput` in `FormPreview.tsx`

---

## Deployment

### Frontend (Vercel)

1.  Push your code to GitHub.
2.  Import the project into [Vercel](https://vercel.com).
3.  Add the following **Environment Variables** in Settings > Environment Variables:
    *   `OPENAI_API_KEY`
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `SUPABASE_SERVICE_ROLE_KEY`
    *   `OCR_SERVICE_URL` (URL of your hosted Python OCR service)

### OCR Service (Render / Railway / Fly.io)

Since the OCR service uses Python and PaddleOCR, it requires a server with enough memory (~2GB recommended).

1.  Deploy the `ocr-service/` directory to a platform that supports Docker or Python (e.g., [Render](https://render.com)).
2.  The service runs on port `8001` (set via `uvicorn`).
3.  Once deployed, copy the service URL and add it to Vercel as `OCR_SERVICE_URL`.

---

## Part of CareStack Suite

| Agent | Role | Status |
|---|---|---|
| **Aria** | Intake forms + OCR | ✅ This app |
| **Keith** | Resource matching network | 🔜 Coming next |
| **Travis** | Case management assistant | 🔜 Coming next |
