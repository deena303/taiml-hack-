import { DigitisationSession } from '../types';

export const SAMPLE_MANUSCRIPTS: DigitisationSession[] = [
  {
    id: 'manuscript-01-manimekalai-1892',
    title: 'மணிமேகலை (Manimekalai) — உ.வே. சாமிநாதையர் பதிப்பு',
    pageNumber: 42,
    sourceType: 'printed_19th_c',
    sourceMetadata: {
      publicationYear: 1892,
      author: 'சீத்தலைச் சாத்தனார் (Seethalai Sathanar)',
      commentary: 'டாக்டர் உ.வே. சாமிநாதையர் பரிசோதனை உரை',
      publisher: 'சாவித்திரி அச்சியந்திரசாலை, சென்னை (Savithri Press, Madras)',
      edition: 'முதற்பதிப்பு (First Edition, 1892)',
      physicalCondition: 'பழுப்பு நிறக் காகிதம்; மெழுகு மை மங்கல்; க், த் எழுத்துகளில் புள்ளி அழிவுற்ற நிலை.',
      archiveReference: 'CICT-DIGI-1892-MNM-P42',
    },
    // We will render high-fidelity canvas simulation for the visual page
    originalImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100"><defs><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/><feDiffuseLighting in="noise" lighting-color="%23f4eedb" surfaceScale="2" result="light"><feDistantLight azimuth="60" elevation="50"/></feDiffuseLighting><feBlend mode="multiply" in="SourceGraphic" in2="light"/></filter></defs><rect width="800" height="1100" fill="%23f7f2e4"/><rect width="760" height="1060" x="20" y="20" fill="%23f3ebdc" stroke="%23d8c8a8" stroke-width="2"/><circle cx="120" cy="850" r="80" fill="%23e8dcbe" opacity="0.4"/><text x="400" y="80" font-family="serif" font-size="18" font-weight="bold" text-anchor="middle" fill="%233a3125">மணிமேகலை — முதற்பதிப்பு (௧௮௯௨)</text><text x="400" y="110" font-family="serif" font-size="14" text-anchor="middle" fill="%236e5d48">பாத்திர மரபு கூறிய காதை (பக்கம் ௪௨)</text><line x1="100" y1="130" x2="700" y2="130" stroke="%235a4d3b" stroke-width="1.5"/><line x1="100" y1="134" x2="700" y2="134" stroke="%235a4d3b" stroke-width="0.5"/><text x="120" y="200" font-family="Noto Serif Tamil, serif" font-size="22" fill="%232b251d">கலங்கரைக் காப்பும் கடலுள் தோன்றும்</text><text x="120" y="260" font-family="Noto Serif Tamil, serif" font-size="22" fill="%232b251d">இலங்குநீர்ப் பரப்பின் இடர்ப்படு மாக்களை</text><text x="120" y="320" font-family="Noto Serif Tamil, serif" font-size="22" fill="%233d3224">அலந்தலை நீக்கி ஆற்றிப் போற்றி</text><text x="120" y="380" font-family="Noto Serif Tamil, serif" font-size="22" fill="%2333281c">நலந்தரு நல்வழி காட்டும் நலங்கிள்ளி</text><line x1="150" y1="440" x2="650" y2="440" stroke="%238a7962" stroke-width="1" stroke-dasharray="4,4"/><text x="120" y="500" font-family="Noto Serif Tamil, serif" font-size="16" fill="%23614e38">[உரைவிளக்கம்: உ.வே.சா அச்சுப்பதிப்பு குறிப்புரை]</text><text x="120" y="550" font-family="Noto Serif Tamil, serif" font-size="18" fill="%232e271f">இடர்ப்படு மாக்கள் எனப்படுவோர் கடலிடைக்கலன்</text><text x="120" y="610" font-family="Noto Serif Tamil, serif" font-size="18" fill="%232e271f">உடைந்து தவிக்கும் வணிகரும் கலக்கமுற்றோரும் ஆவர்.</text><text x="120" y="670" font-family="Noto Serif Tamil, serif" font-size="18" fill="%232e271f">அவர்களது துயர்துடைத்து அறநெறி வளர்த்த பெருமை</text><text x="120" y="730" font-family="Noto Serif Tamil, serif" font-size="18" fill="%232e271f">புகார்ப்பட்டினத்து வணிகர்குடிக்கு உரியதென்க.</text><rect x="420" y="770" width="130" height="30" fill="%23c2b292" opacity="0.45"/><text x="120" y="790" font-family="Noto Serif Tamil, serif" font-size="18" fill="%232e271f">ஆங்கு அமுதுசுரபி வழங்கி பசிப்பிணி தீர்த்தான்.</text></svg>',
    enhancementSettings: {
      brightness: 12,
      contrast: 24,
      grayscale: true,
      denoising: true,
      thresholdMode: 'sauvola',
      thresholdValue: 128,
      invert: false,
    },
    ocrEngine: 'Tesseract OCR v5.3 (tam) + CICT Preprocessing Pipeline',
    ocrTimestamp: '2026-10-14 10:15:22 UTC',
    // Realistic raw OCR with typical historical lead-type errors:
    // 1. "கலங்கரைக்" misread as "கலங்கரக" (dropped pulli ் on க் and right-curl)
    // 2. "இடர்ப்படு" misread as "இடரபடு" (dropped pulli and double consonant)
    // 3. "அலந்தலை" misread as "அலநதலை" (faded loop in ந்த)
    // 4. "பசிப்பிணி" damaged by ink blot -> read as "[?ணி]"
    rawOcrText: `கலங்கரக காப்பும் கடலுள் தோன்றும்
இலங்குநீர்ப் பரப்பின் இடரபடு மாக்களை
அலநதலை நீக்கி ஆற்றிப் போற்றி
நலந்தரு நல்வழி காட்டும் நலங்கிள்ளி

[உரைவிளக்கம்: உ.வே.சா அச்சுப்பதிப்பு குறிப்புரை]
இடர்ப்படு மாக்கள் எனப்படுவோர் கடலிடைக்கலன்
உடைந்து தவிக்கும் வணிகரும் கலக்கமுற்றோரும் ஆவர்.
அவர்களது துயர்துடைத்து அறநெறி வளர்த்த பெருமை
புகார்ப்பட்டினத்து வணிகர்குடிக்கு உரியதென்க.
ஆங்கு அமுதுசுரபி வழங்கி பசிப்[?] தீர்த்தான்.`,
    reviewedText: `கலங்கரைக் காப்பும் கடலுள் தோன்றும்
இலங்குநீர்ப் பரப்பின் இடர்ப்படு மாக்களை
அலந்தலை நீக்கி ஆற்றிப் போற்றி
நலந்தரு நல்வழி காட்டும் நலங்கிள்ளி

[உரைவிளக்கம்: உ.வே.சா அச்சுப்பதிப்பு குறிப்புரை]
இடர்ப்படு மாக்கள் எனப்படுவோர் கடலிடைக்கலன்
உடைந்து தவிக்கும் வணிகரும் கலக்கமுற்றோரும் ஆவர்.
அவர்களது துயர்துடைத்து அறநெறி வளர்த்த பெருமை
புகார்ப்பட்டினத்து வணிகர்குடிக்கு உரியதென்க.
ஆங்கு அமுதுசுரபி வழங்கி [unclear] தீர்த்தான்.`,
    groundTruthText: `கலங்கரைக் காப்பும் கடலுள் தோன்றும்
இலங்குநீர்ப் பரப்பின் இடர்ப்படு மாக்களை
அலந்தலை நீக்கி ஆற்றிப் போற்றி
நலந்தரு நல்வழி காட்டும் நலங்கிள்ளி

[உரைவி elaboration: உ.வே.சா அச்சுப்பதிப்பு குறிப்புரை]
இடர்ப்படு மாக்கள் எனப்படுவோர் கடலிடைக்கலன்
உடைந்து தவிக்கும் வணிகரும் கலக்கமுற்றோரும் ஆவர்.
அவர்களது துயர்துடைத்து அறநெறி வளர்த்த பெருமை
புகார்ப்பட்டினத்து வணிகர்குடிக்கு உரியதென்க.
ஆங்கு அமுதுசுரபி வழங்கி பசிப்பிணி தீர்த்தான்.`,
    tokens: [
      {
        id: 'tok-1',
        wordIndex: 0,
        originalText: 'கலங்கரக',
        currentText: 'கலங்கரைக்',
        candidateText: 'கலங்கரைக்',
        alternatives: [
          {
            text: 'கலங்கரைக்',
            confidence: 0.94,
            evidenceType: 'visual',
            rationale: 'Faded virama (புள்ளி) above final க் and faded diphthong ை curve; confirmed by sandhi with following காப்பும்.',
            isPlausibleGlyphConfusion: true,
          },
          {
            text: 'கலங்கரக',
            confidence: 0.42,
            evidenceType: 'lexical',
            rationale: 'Literal OCR reading; non-grammatical in Sangam Tamil metre (Akaval).',
            isPlausibleGlyphConfusion: false,
          },
        ],
        position: { line: 1, wordNumber: 1, charStart: 0, charEnd: 8, bbox: { x: 120, y: 175, width: 140, height: 35 } },
        ocrConfidence: 0.58,
        isSuspicious: true,
        flagReason: 'Missing terminal pulli ்; morpho-syntactic sandhi mismatch with subsequent "காப்பும்".',
        visualEvidenceStatus: 'faded_ink',
        visualEvidenceNotes: 'Trace of ink dot above consonant க் visible under contrast enhancement (+24%).',
        referenceEvidence: {
          source: 'CICT Suvadi Manuscript Archive: Manimekalai Canto VII v.111',
          matchedReading: 'கலங்கரைக்',
          similarity: 1.0,
          notes: 'Exact match with 1898 secondary palm-leaf collation (Ms #419).',
          isExactMatch: true,
        },
        contextEvidence: {
          sandhiRule: 'வல்லின மெய்ம்மிகல் (க் தோன்றல்): ஐகார ஈற்றுப் பெயர் முன் வல்லினம் மிகும்.',
          grammarRole: 'இரண்டாம் வேற்றுமைத் தொகை',
          notes: 'கலங்கரை + ஐ + காப்பும் -> கலங்கரைக் காப்பும்.',
        },
        reviewStatus: 'human_verified',
        reviewerDecision: 'accepted',
        uncertainPlaceholder: '[unclear]',
        changeHistory: [
          {
            timestamp: '2026-10-14 10:18:04 UTC',
            fromText: 'கலங்கரக',
            toText: 'கலங்கரைக்',
            action: 'Accepted candidate with combined Visual + CICT Reference evidence.',
            evidenceUsed: ['visual_contrast_trace', 'cict_suvadi_ms_419', 'sandhi_rule'],
          },
        ],
      },
      {
        id: 'tok-2',
        wordIndex: 5,
        originalText: 'இடரபடு',
        currentText: 'இடர்ப்படு',
        candidateText: 'இடர்ப்படு',
        alternatives: [
          {
            text: 'இடர்ப்படு',
            confidence: 0.96,
            evidenceType: 'reference',
            rationale: 'Double consonant ர்ப்ப with faded top pulli on ர் and ப்; confirmed by metrical foot (நேர்பு வாய்பாடு).',
            isPlausibleGlyphConfusion: true,
          },
          {
            text: 'இடரபடு',
            confidence: 0.48,
            evidenceType: 'lexical',
            rationale: 'Raw OCR output. Violates Tolkappiyam metric harmony.',
            isPlausibleGlyphConfusion: false,
          },
        ],
        position: { line: 2, wordNumber: 3, charStart: 52, charEnd: 60, bbox: { x: 330, y: 235, width: 110, height: 35 } },
        ocrConfidence: 0.62,
        isSuspicious: true,
        flagReason: 'Dropped virama on ர் and dropped consonant ப் in lead-type print.',
        visualEvidenceStatus: 'partial_damage',
        visualEvidenceNotes: 'Broken character slug in 1892 printing; ink smudge between ர and ப.',
        referenceEvidence: {
          source: 'Madras University Tamil Lexicon Vol. 1, p. 302',
          matchedReading: 'இடர்ப்படு',
          similarity: 1.0,
          notes: 'Attested compound: இடர் + படு = இடர்ப்படு (துன்பமுறுதல்).',
          isExactMatch: true,
        },
        contextEvidence: {
          sandhiRule: 'இடர் + படு -> இடர்ப்படு (இயல்பினும் விதியினும் நின்ற உயிர்முன் கசதப மிகும்).',
          grammarRole: 'வினைத்தொகை / பெயரெச்ச அடுக்கு',
          notes: 'Precedes பெயர்ச்சொல் "மாக்களை".',
        },
        reviewStatus: 'human_verified',
        reviewerDecision: 'accepted',
        uncertainPlaceholder: '[unclear]',
        changeHistory: [
          {
            timestamp: '2026-10-14 10:19:12 UTC',
            fromText: 'இடரபடு',
            toText: 'இடர்ப்படு',
            action: 'Human verifier approved after checking Lexicon and metric foot.',
            evidenceUsed: ['tamil_lexicon_attested', 'metrical_scan'],
          },
        ],
      },
      {
        id: 'tok-3',
        wordIndex: 7,
        originalText: 'அலநதலை',
        currentText: 'அலந்தலை',
        candidateText: 'அலந்தலை',
        alternatives: [
          {
            text: 'அலந்தலை',
            confidence: 0.98,
            evidenceType: 'visual',
            rationale: 'Faded horizontal bridge in ந்த read as isolated ந; classic 19th-century ligature split.',
            isPlausibleGlyphConfusion: true,
          },
        ],
        position: { line: 3, wordNumber: 1, charStart: 72, charEnd: 81, bbox: { x: 120, y: 295, width: 120, height: 35 } },
        ocrConfidence: 0.71,
        isSuspicious: true,
        flagReason: 'OCR ligature separation between consonant and vowel sign.',
        visualEvidenceStatus: 'stroke_match',
        visualEvidenceNotes: 'Magnified view shows continuous ink curve linking ந and த.',
        referenceEvidence: {
          source: 'Sangam Concordance (CICT Digital Archives)',
          matchedReading: 'அலந்தலை',
          similarity: 1.0,
          notes: 'Classical idiom meaning "துன்பமுற்ற நிலை" (Puram 238, Agananuru 121).',
          isExactMatch: true,
        },
        contextEvidence: {
          grammarRole: 'உரிச்சொல் தொடர் / பண்புப் பெயர்',
          notes: 'அலந்தலை நீக்கி = துன்பத்தை அகற்றி.',
        },
        reviewStatus: 'supported_by_reference',
        reviewerDecision: 'accepted',
        uncertainPlaceholder: '[unclear]',
        changeHistory: [
          {
            timestamp: '2026-10-14 10:20:00 UTC',
            fromText: 'அலநதலை',
            toText: 'அலந்தலை',
            action: 'Verified with Sangam Concordance.',
            evidenceUsed: ['sangam_corpus', 'visual_magnification'],
          },
        ],
      },
      {
        id: 'tok-4',
        wordIndex: 35,
        originalText: 'பசிப்[?]',
        currentText: '[unclear]',
        candidateText: undefined, // CRITICAL: System refuses to hallucinate when visual evidence is damaged!
        alternatives: [
          {
            text: 'பசிப்பிணி',
            confidence: 0.65,
            evidenceType: 'context',
            rationale: 'Common Manimekalai collocation (பசிப்பிணி மருத்துவன்), but image has deep ink blot and torn fiber. Refused automated adoption.',
            isPlausibleGlyphConfusion: false,
          },
          {
            text: 'பசிப்பகை',
            confidence: 0.38,
            evidenceType: 'context',
            rationale: 'Attested variant in Tanjore Saraswathi Mahal Ms #201, but unprovable from this page.',
            isPlausibleGlyphConfusion: false,
          },
        ],
        position: { line: 10, wordNumber: 4, charStart: 380, charEnd: 389, bbox: { x: 420, y: 765, width: 140, height: 40 } },
        ocrConfidence: 0.18,
        isSuspicious: true,
        flagReason: 'SEVERE INK BLOT & FIBER HOLE. No defensible character strokes remain in the source scan.',
        visualEvidenceStatus: 'severe_damage',
        visualEvidenceNotes: 'Deep blotch (density >92%) obliterates subsequent 2 glyphs. Speculating a word here would violate anti-hallucination policy.',
        referenceEvidence: {
          source: 'Tanjore Saraswathi Mahal Palm Leaf Ms #201 vs U.Ve.Sa text',
          matchedReading: 'Disputed: பசிப்பிணி vs பசிப்பகை',
          similarity: 0.5,
          notes: 'Conflicting manuscript traditions exist. The scanned print cannot arbitrate.',
          isExactMatch: false,
        },
        contextEvidence: {
          notes: 'While AI language model predicts "பசிப்பிணி" with 94% prior probability, visual absence requires holding this as [unclear] to prevent silent corruption.',
        },
        reviewStatus: 'uncertain',
        reviewerDecision: 'marked_uncertain',
        uncertainPlaceholder: '[unclear]',
        changeHistory: [
          {
            timestamp: '2026-10-14 10:21:40 UTC',
            fromText: 'பசிப்[?]',
            toText: '[unclear]',
            action: 'Flagged UNCERTAIN under Anti-Hallucination Rule #6 & #7. Refused AI guess.',
            evidenceUsed: ['visual_severe_damage', 'conflicting_manuscript_variants'],
          },
        ],
      },
    ],
    referenceComparisons: [
      {
        id: 'ref-comp-1',
        title: 'மணிமேகலை உரை ஒப்பீடு (CICT Classical Text vs 1892 Scanned Page)',
        source: 'மத்திய செம்மொழித் தமிழாய்வு நிறுவனம் (CICT) டிஜிட்டல் ஆவணக் காப்பகம்',
        extractedSegment: 'கலங்கரைக் காப்பும் கடலுள் தோன்றும் இலங்குநீர்ப் பரப்பின் இடர்ப்படு மாக்களை அலந்தலை நீக்கி ஆற்றிப் போற்றி நலந்தரு நல்வழி காட்டும் நலங்கிள்ளி',
        referenceText: 'கலங்கரைக் காப்பும் கடலுள் தோன்றும் இலங்குநீர்ப் பரப்பின் இடர்ப்படு மாக்களை அலந்தலை நீக்கி ஆற்றிப் போற்றி நலந்தரு நல்வழி காட்டும் நலங்கிள்ளி',
        alignedWords: [
          { originalWord: 'கலங்கரைக்', referenceWord: 'கலங்கரைக்', matchType: 'exact', evidenceNotes: 'Accurate match after verified correction of faded pulli.' },
          { originalWord: 'காப்பும்', referenceWord: 'காப்பும்', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'கடலுள்', referenceWord: 'கடலுள்', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'தோன்றும்', referenceWord: 'தோன்றும்', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'இலங்குநீர்ப்', referenceWord: 'இலங்குநீர்ப்', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'பரப்பின்', referenceWord: 'பரப்பின்', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'இடர்ப்படு', referenceWord: 'இடர்ப்படு', matchType: 'exact', evidenceNotes: 'Verified via metric scan.' },
          { originalWord: 'மாக்களை', referenceWord: 'மாக்களை', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'அலந்தலை', referenceWord: 'அலந்தலை', matchType: 'exact', evidenceNotes: 'Exact match after ligature fix.' },
          { originalWord: 'நீக்கி', referenceWord: 'நீக்கி', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'ஆற்றிப்', referenceWord: 'ஆற்றிப்', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'போற்றி', referenceWord: 'போற்றி', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'நலந்தரு', referenceWord: 'நலந்தரு', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'நல்வழி', referenceWord: 'நல்வழி', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'காட்டும்', referenceWord: 'காட்டும்', matchType: 'exact', evidenceNotes: 'Exact match.' },
          { originalWord: 'நலங்கிள்ளி', referenceWord: 'நலங்கிள்ளி', matchType: 'exact', evidenceNotes: 'Exact match.' },
        ],
        cer: 0.0,
      },
    ],
    auditTrail: [
      {
        id: 'aud-1',
        timestamp: '2026-10-14 10:15:22 UTC',
        tokenId: 'session-init',
        originalReading: 'N/A',
        newReading: 'Raw OCR completed with 4 suspicious tokens flagged.',
        action: 'edit',
        evidenceType: 'manual',
        evidenceDetails: 'Initial OCR ingest from Savithri Press 1892 edition scan.',
        operator: 'System OCR Ingest',
      },
      {
        id: 'aud-2',
        timestamp: '2026-10-14 10:18:04 UTC',
        tokenId: 'tok-1',
        originalReading: 'கலங்கரக',
        newReading: 'கலங்கரைக்',
        action: 'accept',
        evidenceType: 'visual',
        evidenceDetails: 'Accepted candidate with combined Visual + CICT Reference evidence.',
        operator: 'Epigraphist Reviewer (TamilVault)',
      },
      {
        id: 'aud-3',
        timestamp: '2026-10-14 10:19:12 UTC',
        tokenId: 'tok-2',
        originalReading: 'இடரபடு',
        newReading: 'இடர்ப்படு',
        action: 'accept',
        evidenceType: 'reference',
        evidenceDetails: 'Approved by metric scan and Madras University Tamil Lexicon match.',
        operator: 'Epigraphist Reviewer (TamilVault)',
      },
      {
        id: 'aud-4',
        timestamp: '2026-10-14 10:20:00 UTC',
        tokenId: 'tok-3',
        originalReading: 'அலநதலை',
        newReading: 'அலந்தலை',
        action: 'accept',
        evidenceType: 'reference',
        evidenceDetails: 'Ligature continuity verified under 300% zoom and Sangam concordance.',
        operator: 'Epigraphist Reviewer (TamilVault)',
      },
      {
        id: 'aud-5',
        timestamp: '2026-10-14 10:21:40 UTC',
        tokenId: 'tok-4',
        originalReading: 'பசிப்[?]',
        newReading: '[unclear]',
        action: 'mark_uncertain',
        evidenceType: 'visual',
        evidenceDetails: 'Enforced Hallucination Prevention Rule #6. Severe blot obliterates strokes; AI language guess rejected.',
        operator: 'Epigraphist Reviewer (TamilVault)',
      },
    ],
    evaluation: {
      referenceTranscriptionAvailable: true,
      rawOcrCer: 0.0842, // 8.42% raw OCR error
      reviewedCer: 0.0094, // 0.94% post-review error (remaining error is strictly the preserved [unclear])
      characterSubstitutions: 4,
      characterDeletions: 3,
      characterInsertions: 1,
      totalReferenceCharacters: 412,
      correctionsAccepted: 3,
      correctionsRejected: 0,
      uncertainWordsCount: 1,
      assistedPrecision: 1.0,
      hallucinationPreventionScore: 100, // 100% of unsupported hallucinations intercepted
    },
    uncertaintyNotation: '[unclear]',
    isDemoSample: true,
  },
  {
    id: 'manuscript-02-bharatiyar-1908',
    title: 'சுதேச கீதங்கள் (Swadesha Geethangal) — மகாகவி பாரதியார்',
    pageNumber: 15,
    sourceType: 'early_press_20th_c',
    sourceMetadata: {
      publicationYear: 1908,
      author: 'சி. சுப்பிரமணிய பாரதி (Mahakavi Bharati)',
      commentary: 'சுதேசமித்திரன் அச்சியந்திரசாலை பதிப்பு',
      publisher: 'இந்தியா பத்திரிகை அலுவலகம், சென்னை',
      edition: 'சுதேச கீதங்கள் முதற்பதிப்பு (1908)',
      physicalCondition: 'காகித ஊடுருவல் (Ink bleed through from reverse page); மெல்லிய சிவந்த மை தடம்.',
      archiveReference: 'CICT-DIGI-1908-BHARATI-P15',
    },
    originalImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100"><rect width="800" height="1100" fill="%23fdfaf2"/><rect width="760" height="1060" x="20" y="20" fill="%23fbf5e6" stroke="%23dfd4be" stroke-width="1.5"/><text x="400" y="80" font-family="serif" font-size="20" font-weight="bold" text-anchor="middle" fill="%2345261d">சுதேச கீதங்கள் (௧௯௦௮)</text><text x="400" y="115" font-family="serif" font-size="14" text-anchor="middle" fill="%237b5645">வந்தே மாதரம் வாழ்த்தியது — பாரதியார்</text><line x1="120" y1="135" x2="680" y2="135" stroke="%23845b46" stroke-width="1"/><text x="140" y="210" font-family="Noto Serif Tamil, serif" font-size="24" fill="%232b211a">செந்தமிழ் நாடெனும் போதினிலே - இன்பத்</text><text x="140" y="270" font-family="Noto Serif Tamil, serif" font-size="24" fill="%232b211a">தேன்வந்து பாயுது காதினிலே - எங்கள்</text><text x="140" y="330" font-family="Noto Serif Tamil, serif" font-size="24" fill="%232b211a">தந்தையர் நாடென்று பேச்சினிலே - ஒரு</text><text x="140" y="390" font-family="Noto Serif Tamil, serif" font-size="24" fill="%232b211a">சக்தி பிறக்குது மூச்சினிலே.</text><line x1="200" y1="450" x2="600" y2="450" stroke="%23b89e85" stroke-width="0.8"/><text x="140" y="520" font-family="Noto Serif Tamil, serif" font-size="24" fill="%232b211a">வேதம் நிறைந்த தமிழ்நாடு - உயர்</text><text x="140" y="580" font-family="Noto Serif Tamil, serif" font-size="24" fill="%232b211a">வீரம் செறிந்த தமிழ்நாடு - நல்ல</text><text x="140" y="640" font-family="Noto Serif Tamil, serif" font-size="24" fill="%232b211a">காதல் புரியும் இல்லறமும் - அறக்</text><text x="140" y="700" font-family="Noto Serif Tamil, serif" font-size="24" fill="%232b211a">காட்சிகள் பூத்த தமிழ்நாடு.</text></svg>',
    enhancementSettings: {
      brightness: 8,
      contrast: 28,
      grayscale: true,
      denoising: true,
      thresholdMode: 'otsu',
      thresholdValue: 135,
      invert: false,
    },
    ocrEngine: 'Tesseract OCR v5.3 (tam) + Adaptive Binarization',
    ocrTimestamp: '2026-10-14 11:04:10 UTC',
    rawOcrText: `செந்தமில நாடெனும் போதினிலே - இன்பத்
தேன்வந்து பாயுது காதினிலே - எங்கள்
தந்தையர நாடென்று பேச்சினிலே - ஒரு
சக்தி பிறக்குது மூச்சினிலே.

வேதம் நிறைந்த தமிழ்நாடு - உயர்
வீரம செறிந்த தமிழ்நாடு - நல்ல
காதல் புரியும இல்லறமும் - அறக்
காட்சிகள் பூத்த தமிழ்நாடு.`,
    reviewedText: `செந்தமிழ் நாடெனும் போதினிலே - இன்பத்
தேன்வந்து பாயுது காதினிலே - எங்கள்
தந்தையர் நாடென்று பேச்சினிலே - ஒரு
சக்தி பிறக்குது மூச்சினிலே.

வேதம் நிறைந்த தமிழ்நாடு - உயர்
வீரம் செறிந்த தமிழ்நாடு - நல்ல
காதல் புரியும் இல்லறமும் - அறக்
காட்சிகள் பூத்த தமிழ்நாடு.`,
    groundTruthText: `செந்தமிழ் நாடெனும் போதினிலே - இன்பத்
தேன்வந்து பாயுது காதினிலே - எங்கள்
தந்தையர் நாடென்று பேச்சினிலே - ஒரு
சக்தி பிறக்குது மூச்சினிலே.

வேதம் நிறைந்த தமிழ்நாடு - உயர்
வீரம் செறிந்த தமிழ்நாடு - நல்ல
காதல் புரியும் இல்லறமும் - அறக்
காட்சிகள் பூத்த தமிழ்நாடு.`,
    tokens: [
      {
        id: 'tok-b1',
        wordIndex: 0,
        originalText: 'செந்தமில',
        currentText: 'செந்தமிழ்',
        candidateText: 'செந்தமிழ்',
        alternatives: [
          {
            text: 'செந்தமிழ்',
            confidence: 0.99,
            evidenceType: 'visual',
            rationale: 'Retroflex special rhotic ழ் misread as alveolar ல; bottom curl of ழ் faded in thin newsprint.',
            isPlausibleGlyphConfusion: true,
          },
        ],
        position: { line: 1, wordNumber: 1, charStart: 0, charEnd: 8, bbox: { x: 140, y: 185, width: 130, height: 35 } },
        ocrConfidence: 0.65,
        isSuspicious: true,
        flagReason: 'Character substitution: ல for ழ் due to faded bottom loop.',
        visualEvidenceStatus: 'faded_ink',
        visualEvidenceNotes: 'Magnified view shows pale gray curve at base of glyph.',
        referenceEvidence: {
          source: 'Bharatiyar Kavithaigal, Sahitya Akademi Definitive Edition',
          matchedReading: 'செந்தமிழ்',
          similarity: 1.0,
          notes: 'Standard opening line of celebrated poem.',
          isExactMatch: true,
        },
        contextEvidence: {
          sandhiRule: 'செம்மை + தமிழ் -> செந்தமிழ் (மை ஈறு கெட்டு மகரம் னகரமாதல்).',
          notes: 'Standard classical Tamil compound.',
        },
        reviewStatus: 'human_verified',
        reviewerDecision: 'accepted',
        uncertainPlaceholder: '[unclear]',
        changeHistory: [
          {
            timestamp: '2026-10-14 11:05:30 UTC',
            fromText: 'செந்தமில',
            toText: 'செந்தமிழ்',
            action: 'Accepted candidate supported by Sahitya Akademi edition and visual inspection.',
            evidenceUsed: ['visual_magnification', 'sahitya_akademi_corpus'],
          },
        ],
      },
      {
        id: 'tok-b2',
        wordIndex: 7,
        originalText: 'தந்தையர',
        currentText: 'தந்தையர்',
        candidateText: 'தந்தையர்',
        alternatives: [
          {
            text: 'தந்தையர்',
            confidence: 0.98,
            evidenceType: 'visual',
            rationale: 'Missing pulli on terminal ர், read as vowel-inherent ர.',
            isPlausibleGlyphConfusion: true,
          },
        ],
        position: { line: 3, wordNumber: 1, charStart: 70, charEnd: 79, bbox: { x: 140, y: 305, width: 120, height: 35 } },
        ocrConfidence: 0.72,
        isSuspicious: true,
        flagReason: 'Missing virama on terminal rhotic consonant.',
        visualEvidenceStatus: 'faded_ink',
        visualEvidenceNotes: 'Small dot impression visible in paper fiber.',
        referenceEvidence: {
          source: 'Bharatiyar Swadesha Geethangal 1908 Original Stanzas',
          matchedReading: 'தந்தையர்',
          similarity: 1.0,
          notes: 'Plural honorific noun (தந்தையர்).',
          isExactMatch: true,
        },
        reviewStatus: 'human_verified',
        reviewerDecision: 'accepted',
        uncertainPlaceholder: '[unclear]',
        changeHistory: [],
      },
      {
        id: 'tok-b3',
        wordIndex: 17,
        originalText: 'வீரம',
        currentText: 'வீரம்',
        candidateText: 'வீரம்',
        alternatives: [
          {
            text: 'வீரம்',
            confidence: 0.99,
            evidenceType: 'visual',
            rationale: 'Missing pulli on terminal ம்.',
            isPlausibleGlyphConfusion: true,
          },
        ],
        position: { line: 6, wordNumber: 1, charStart: 180, charEnd: 185, bbox: { x: 140, y: 555, width: 90, height: 35 } },
        ocrConfidence: 0.76,
        isSuspicious: true,
        flagReason: 'Terminal consonant without pulli.',
        visualEvidenceStatus: 'stroke_match',
        visualEvidenceNotes: 'Faded dot visible atop the loop.',
        referenceEvidence: {
          source: 'Bharatiyar Kavithaigal 1908',
          matchedReading: 'வீரம்',
          similarity: 1.0,
          notes: 'Standard noun.',
          isExactMatch: true,
        },
        reviewStatus: 'human_verified',
        reviewerDecision: 'accepted',
        uncertainPlaceholder: '[unclear]',
        changeHistory: [],
      },
      {
        id: 'tok-b4',
        wordIndex: 21,
        originalText: 'புரியும',
        currentText: 'புரியும்',
        candidateText: 'புரியும்',
        alternatives: [
          {
            text: 'புரியும்',
            confidence: 0.98,
            evidenceType: 'visual',
            rationale: 'Missing pulli on terminal ம்.',
            isPlausibleGlyphConfusion: true,
          },
        ],
        position: { line: 7, wordNumber: 2, charStart: 215, charEnd: 222, bbox: { x: 230, y: 615, width: 110, height: 35 } },
        ocrConfidence: 0.74,
        isSuspicious: true,
        flagReason: 'Missing pulli ் on terminal மகரம்.',
        visualEvidenceStatus: 'stroke_match',
        visualEvidenceNotes: 'Indent on paper matches woodblock press pulli.',
        referenceEvidence: {
          source: 'Bharatiyar Kavithaigal 1908',
          matchedReading: 'புரியும்',
          similarity: 1.0,
          notes: 'செய்யும் என்னும் வாய்பாட்டுப் பெயரெச்சம்.',
          isExactMatch: true,
        },
        reviewStatus: 'human_verified',
        reviewerDecision: 'accepted',
        uncertainPlaceholder: '[unclear]',
        changeHistory: [],
      },
    ],
    referenceComparisons: [],
    auditTrail: [],
    evaluation: {
      referenceTranscriptionAvailable: true,
      rawOcrCer: 0.052,
      reviewedCer: 0.0,
      characterSubstitutions: 1,
      characterDeletions: 0,
      characterInsertions: 3,
      totalReferenceCharacters: 320,
      correctionsAccepted: 4,
      correctionsRejected: 0,
      uncertainWordsCount: 0,
      assistedPrecision: 1.0,
      hallucinationPreventionScore: 100,
    },
    uncertaintyNotation: '[unclear]',
    isDemoSample: true,
  },
  {
    id: 'manuscript-03-thirukkural-1904',
    title: 'திருக்குறள் பரிமேலழகருரை (Tirukkural) — 1904 பதிப்பு',
    pageNumber: 89,
    sourceType: 'palm_leaf_lithograph',
    sourceMetadata: {
      publicationYear: 1904,
      author: 'திருவள்ளுவர் (Thiruvalluvar)',
      commentary: 'பரிமேலழகர் உரை (Parimelalhagar Commentary)',
      publisher: 'ரிப்பன்பிரசு, சென்னை (Ripon Press, Madras)',
      edition: 'பரிமேலழகருரை பரிசோதனைப் பதிப்பு (1904)',
      physicalCondition: 'பக்க விளிம்பு கிழிசல்; ஏட்டுச்சுவடியிலிருந்து அச்சுக்கு மாறிய தொடக்கக் கால அச்சுருவம்.',
      archiveReference: 'CICT-DIGI-1904-TK-P89',
    },
    originalImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100"><rect width="800" height="1100" fill="%23f6f0df"/><rect width="760" height="1060" x="20" y="20" fill="%23f1e9d2" stroke="%23cfbea0" stroke-width="2"/><text x="400" y="75" font-family="serif" font-size="20" font-weight="bold" text-anchor="middle" fill="%233b2e20">திருக்குறள் — பரிமேலழகருரை (௧௯௦௪)</text><text x="400" y="105" font-family="serif" font-size="14" text-anchor="middle" fill="%236c5840">கல்வி அதிகாரம் — குறள் ௩௯௧ (பக்கம் ௮௯)</text><line x1="100" y1="125" x2="700" y2="125" stroke="%235a4732" stroke-width="1.5"/><text x="120" y="195" font-family="Noto Serif Tamil, serif" font-size="24" fill="%232b2116">கற்க கசடறக் கற்பவை கற்றபின்</text><text x="120" y="255" font-family="Noto Serif Tamil, serif" font-size="24" fill="%232b2116">நிற்க அதற்குத் தக.</text><line x1="120" y1="290" x2="680" y2="290" stroke="%239a856a" stroke-width="0.8"/><text x="120" y="345" font-family="Noto Serif Tamil, serif" font-size="16" fill="%235f4b35">[பரிமேலழகர் உரை:]</text><text x="120" y="395" font-family="Noto Serif Tamil, serif" font-size="18" fill="%232a2015">கற்கப்படு நூல்களை ஐயந்திரிபறக் கற்க;</text><text x="120" y="445" font-family="Noto Serif Tamil, serif" font-size="18" fill="%232a2015">அங்ஙனம் கற்றபின் அந்நூல் விதித்த நெறியின்கண்</text><text x="120" y="495" font-family="Noto Serif Tamil, serif" font-size="18" fill="%232a2015">தவறாது நிற்றல் வேண்டும் என்பது கருத்து.</text></svg>',
    enhancementSettings: {
      brightness: 15,
      contrast: 22,
      grayscale: true,
      denoising: false,
      thresholdMode: 'sauvola',
      thresholdValue: 125,
      invert: false,
    },
    ocrEngine: 'Tesseract OCR v5.3 (tam) + CICT Suvadi Tuned Model',
    ocrTimestamp: '2026-10-14 11:30:00 UTC',
    rawOcrText: `கரக கசடறக கற்பவை கற்றபின்
நிற்க அதற்குத தக.

[பரிமேலழகர் உரை:]
கற்கப்படு நூல்களை ஐயநதிரிபறக கற்க;
அங்ஙனம் கற்றபின் அந்நூல் விதித்த நெறியின்கண்
தவறாது நிற்றல் வேண்டும் என்பது கருத்து.`,
    reviewedText: `கற்க கசடறக் கற்பவை கற்றபின்
நிற்க அதற்குத் தக.

[பரிமேலழகர் உரை:]
கற்கப்படு நூல்களை ஐயந்திரிபறக் கற்க;
அங்ஙனம் கற்றபின் அந்நூல் விதித்த நெறியின்கண்
தவறாது நிற்றல் வேண்டும் என்பது கருத்து.`,
    groundTruthText: `கற்க கசடறக் கற்பவை கற்றபின்
நிற்க அதற்குத் தக.

[பரிமேலழகர் உரை:]
கற்கப்படு நூல்களை ஐயந்திரிபறக் கற்க;
அங்ஙனம் கற்றபின் அந்நூல் விதித்த நெறியின்கண்
தவறாது நிற்றல் வேண்டும் என்பது கருத்து.`,
    tokens: [
      {
        id: 'tok-tk1',
        wordIndex: 0,
        originalText: 'கரக',
        currentText: 'கற்க',
        candidateText: 'கற்க',
        alternatives: [
          {
            text: 'கற்க',
            confidence: 0.99,
            evidenceType: 'visual',
            rationale: 'Faded pulli on consonant ற் (கரக -> கற்க). Classic lead-type degradation.',
            isPlausibleGlyphConfusion: true,
          },
        ],
        position: { line: 1, wordNumber: 1, charStart: 0, charEnd: 4, bbox: { x: 120, y: 170, width: 80, height: 35 } },
        ocrConfidence: 0.54,
        isSuspicious: true,
        flagReason: 'Missing virama on ற் inside consonant cluster.',
        visualEvidenceStatus: 'faded_ink',
        visualEvidenceNotes: 'Faded lead slug imprint shows dot depression.',
        referenceEvidence: {
          source: 'Tirukkural Kural #391 (CICT Classical Tamil Concordance)',
          matchedReading: 'கற்க',
          similarity: 1.0,
          notes: 'Celebrated opening word of Kalvi Athikaram.',
          isExactMatch: true,
        },
        contextEvidence: {
          grammarRole: 'வியங்கோள் வினைமுற்று',
          notes: 'கற்க = படிக்கவும் / பயில்க.',
        },
        reviewStatus: 'human_verified',
        reviewerDecision: 'accepted',
        uncertainPlaceholder: '[unclear]',
        changeHistory: [],
      },
    ],
    referenceComparisons: [],
    auditTrail: [],
    evaluation: {
      referenceTranscriptionAvailable: true,
      rawOcrCer: 0.048,
      reviewedCer: 0.0,
      characterSubstitutions: 0,
      characterDeletions: 0,
      characterInsertions: 4,
      totalReferenceCharacters: 215,
      correctionsAccepted: 4,
      correctionsRejected: 0,
      uncertainWordsCount: 0,
      assistedPrecision: 1.0,
      hallucinationPreventionScore: 100,
    },
    uncertaintyNotation: '[unclear]',
    isDemoSample: true,
  },
];
