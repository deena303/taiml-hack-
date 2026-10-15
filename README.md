# TamilVault AI — Trustworthy Tamil Book Digitisation

> **Core Archival Mandate:** When original physical evidence is insufficient, the system must preserve uncertainty (`[unclear]`) rather than invent historical Tamil text.

**TamilVault AI** is a specialized digital-humanities platform engineered to transcribe, enhance, verify, and digitise 100-year-old Tamil printed books, lithographs, and palm-leaf manuscripts plagued by faded ink, paper bleed-through, lost virama dots (்), and high OCR error rates.

---

## 1. System Architecture

```text
       ┌────────────────────────────────────────────────────────┐
       │ 100-Year-Old Scanned Tamil Book (JPG / PNG / WebP)      │
       └─────────────────────────┬──────────────────────────────┘
                                 │
                     [1. Archival Ingestion]
                     (Bitstream permanently locked)
                                 │
                                 ▼
       ┌────────────────────────────────────────────────────────┐
       │ Image Enhancement Engine (Canvas / OpenCV Filters)     │
       │ - Sauvola Local Adaptive Binarization (k=0.2, R=128)   │
       │ - Otsu Global Thresholding                             │
       │ - Denoising & Contrast Normalization                   │
       └─────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
       ┌────────────────────────────────────────────────────────┐
       │ Tamil OCR Pipeline                                     │
       │ - Gemini 3.8 Multimodal Vision / Tesseract tam         │
       │ - Raw OCR Text locked in immutable storage             │
       └─────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
       ┌────────────────────────────────────────────────────────┐
       │ AI-Assisted Anti-Hallucination Evidence Engine         │
       │ - Rule 1 & 2: Raw OCR text is NEVER overwritten       │
       │ - Rule 3: Confined to historical printing confusion   │
       │   (faded pulli ், ா vs ர ligature blur, ண vs ன)      │
       │ - Rule 4 & 5: Tri-Partite Evidence Requirement         │
       │   [Visual Traces] + [Reference Corpus] + [Grammar]     │
       │ - Rule 6 & 7: Refusal to guess damaged text            │
       │   (Strict preservation of [unclear] / [சிதைவு])        │
       └─────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
       ┌────────────────────────────────────────────────────────┐
       │ Human-in-the-Loop Epigraphic Review                    │
       │ - Accept / Reject / Edit / Mark Uncertain              │
       │ - Synchronized zoomed scan inspection                  │
       │ - Keyboard shortcuts (A, R, U, E)                      │
       └─────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
       ┌────────────────────────────────────────────────────────┐
       │ Scholarly Export & Quantitative Evaluation             │
       │ - Character Error Rate (CER) = (S + D + I) / N         │
       │ - UTF-8 Plain Text with preserved [unclear]            │
       │ - ISO-compliant CSV Audit Trail                        │
       │ - Full Archival JSON Package                           │
       └────────────────────────────────────────────────────────┘
```

---

## 2. The 10 Anti-Hallucination Rules

1. **Preserve Original Scanned Image & Raw OCR:** The raw scan and OCR output are permanently isolated and never modified.
2. **Never Overwrite Raw OCR Text:** AI suggestions are kept in separate candidate layers; raw transcription is preserved verbatim.
3. **Plausible Basis Only:** Suggestions are limited to documented historical lead-type confusions (pulli absence, ligature blurring, nasal loop erosion).
4. **Evidence Mandate:** No candidate can be labeled "verified" without explicit corroborating proof.
5. **Separate Evidence Categories:**
   - **Visual Evidence:** Glyph stroke traces, paper fiber condition, ink density.
   - **Reference Corpus Evidence:** Attestation in Classical Tamil literature (CICT Suvadi, Tamil Lexicon).
   - **Grammatical Evidence:** Tamil sandhi mutation rules and Tolkappiyam metrics.
6. **Refusal to Hallucinate:** If paper holes or ink blots destroy character strokes, the engine refuses automated speculation.
7. **Uncertainty Placeholders:** Damaged characters are explicitly transcribed as `[unclear]`, `[சிதைவு]`, or `[ஐயம்]`.
8. **No Fabricated Citations:** Never invent manuscript readings, citations, or artificial confidence scores.
9. **Reviewer Sovereignty:** The human epigraphist retains supreme authority over all text alterations.
10. **Immutable Audit Trail:** Every decision logs timestamp, operator, prior text, new text, and rationale.

---

## 3. Included Historical Datasets

The platform includes authentic 100-year-old Tamil digitisation sessions:

1. **Manimekalai (1892)** — First Edition by Dr. U.Ve. Swaminatha Iyer (Savithri Press, Madras). Faded virama dots on க், த்; character damage from ink blot requiring explicit `[unclear]` uncertainty.
2. **Swadesha Geethangal (1908)** — Mahakavi Subramania Bharati (India Press, Madras). Paper bleed-through from reverse page; retroflex ழ் / alveolar ல blur.
3. **Thirukkural Parimelalhagar Commentary (1904)** — Ripon Press lead-type edition. Palm-leaf to early typography transition; dropped pulli on consonant clusters.

---

## 4. Installation & Running Locally

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Start the development server (runs full-stack Express + Vite on port 3000)
npm run dev

# 3. Build for production
npm run build
npm start
```

### Environment Variables
Optionally configure `GEMINI_API_KEY` in your `.env` for live multimodal vision OCR:
```env
GEMINI_API_KEY="your-api-key"
```
*(If no API key is provided, the platform automatically runs in Archival Benchmark Mode with full functionality).*
