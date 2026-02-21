"""
Aria OCR Microservice
FastAPI + PaddleOCR for intake form digitization

Install:
  pip install fastapi uvicorn paddleocr paddlepaddle Pillow python-multipart

Run:
  uvicorn main:app --port 8001 --reload
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
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy load PaddleOCR (it's heavy)
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
    """
    Heuristically identify label:value pairs from OCR text lines.
    Common patterns in intake forms:
      - "Name: John Doe"
      - "Date of Birth: ___"  
      - "[ ] Yes  [ ] No"
    """
    fields = []
    
    for line in lines:
        line = line.strip()
        if not line or len(line) < 2:
            continue
        
        # Pattern: "Label: Value" or "Label:"
        colon_match = re.match(r'^([A-Za-z][A-Za-z\s/()-]{1,40})\s*:\s*(.*?)$', line)
        if colon_match:
            label = colon_match.group(1).strip()
            value = colon_match.group(2).strip()
            # Skip if value looks like a blank/underscores
            if re.match(r'^[_\-\s]+$', value) or not value:
                value = ''
            fields.append(OCRField(label=label, value=value, confidence=0.85))
            continue
        
        # Pattern: checkbox style "[ ] Option"
        checkbox_match = re.match(r'^\[[\s×xX✓]\]\s+(.+)$', line)
        if checkbox_match:
            fields.append(OCRField(
                label=checkbox_match.group(1).strip(),
                value='checkbox',
                confidence=0.75
            ))
            continue
    
    return fields


@app.get("/health")
def health():
    return {"status": "ok", "service": "Aria OCR"}


@app.post("/ocr", response_model=OCRResponse)
async def run_ocr(file: UploadFile = File(...)):
    """
    Accept an image (JPG, PNG, TIFF, BMP) or PDF page.
    Returns extracted text and parsed form fields.
    """
    if not file.content_type:
        raise HTTPException(400, "No file content type")
    
    allowed_types = {
        "image/jpeg", "image/png", "image/tiff",
        "image/bmp", "image/webp", "application/pdf"
    }
    if file.content_type not in allowed_types:
        raise HTTPException(400, f"Unsupported file type: {file.content_type}")
    
    contents = await file.read()
    
    try:
        # Convert to image
        if file.content_type == "application/pdf":
            # For PDF: use first page via pdf2image (optional dep)
            try:
                import pdf2image
                images = pdf2image.convert_from_bytes(contents, first_page=1, last_page=1)
                img = images[0]
            except ImportError:
                raise HTTPException(
                    500,
                    "pdf2image not installed. Run: pip install pdf2image poppler-utils"
                )
        else:
            img = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Convert PIL image to numpy array for PaddleOCR
        import numpy as np
        img_array = np.array(img)
        
        # Run OCR
        ocr = get_ocr()
        result = ocr.ocr(img_array, cls=True)
        
        if not result or not result[0]:
            return OCRResponse(
                raw_text="No text detected in image.",
                fields=[],
                line_count=0,
                confidence_avg=0.0,
            )
        
        # Extract text and confidence
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
        
        # Parse form fields
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
