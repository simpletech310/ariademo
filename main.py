"""
Aria OCR Microservice
FastAPI + PaddleOCR for intake form digitization
"""

import io
import re
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

app = FastAPI(title="Aria OCR Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy load PaddleOCR
_ocr = None

def get_ocr():
    global _ocr
    if _ocr is None:
        from paddleocr import PaddleOCR
        _ocr = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
    return _ocr

class OCRField(BaseModel):
    label: str
    value: str
    confidence: float

class OCRResponse(BaseModel):
    raw_text: str
    fields: list[OCRField]
    line_count: int
    confidence_avg: float

def parse_form_fields(lines: list[str]) -> list[OCRField]:
    fields = []
    for line in lines:
        line = line.strip()
        if not line or len(line) < 2:
            continue
        colon_match = re.match(r'^([A-Za-z][A-Za-z\s/()-]{1,40})\s*:\s*(.*?)$', line)
        if colon_match:
            label = colon_match.group(1).strip()
            value = colon_match.group(2).strip()
            if re.match(r'^[_\-\s]+$', value) or not value:
                value = ''
            fields.append(OCRField(label=label, value=value, confidence=0.85))
    return fields

@app.get("/health")
def health():
    return {"status": "ok", "service": "Aria OCR"}

@app.post("/ocr", response_model=OCRResponse)
async def run_ocr(file: UploadFile = File(...)):
    if not file.content_type:
        raise HTTPException(400, "No file content type")
    
    contents = await file.read()
    
    try:
        if file.content_type == "application/pdf":
            import pdf2image
            images = pdf2image.convert_from_bytes(contents, first_page=1, last_page=1)
            img = images[0]
        else:
            img = Image.open(io.BytesIO(contents)).convert("RGB")
        
        import numpy as np
        img_array = np.array(img)
        
        ocr = get_ocr()
        result = ocr.ocr(img_array, cls=True)
        
        if not result or not result[0]:
            return OCRResponse(raw_text="No text detected.", fields=[], line_count=0, confidence_avg=0.0)
        
        lines = []
        confidences = []
        for line in result[0]:
            if line and len(line) >= 2:
                text = line[1][0]
                conf = float(line[1][1])
                lines.append(text)
                confidences.append(conf)
        
        raw_text = "\n".join(lines)
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
        fields = parse_form_fields(lines)
        
        return OCRResponse(
            raw_text=raw_text,
            fields=fields,
            line_count=len(lines),
            confidence_avg=round(avg_confidence, 3),
        )
    except Exception as e:
        raise HTTPException(500, f"OCR processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
