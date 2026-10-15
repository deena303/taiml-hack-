/**
 * Tamil Linguistic and Archival Orthography Utilities
 * Supports Tamil Unicode grapheme segmentation, historical glyph confusion detection,
 * and standard CER (Character Error Rate) computation for digital humanities.
 */

// Break Tamil text into perceptual grapheme clusters (combining vowel signs and virama stay with base consonant)
export function getTamilGraphemes(text: string): string[] {
  if (!text) return [];
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('ta', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), s => s.segment);
  }
  // Fallback regex for Tamil graphemes if Intl.Segmenter unavailable
  // Tamil block: \u0B80-\u0BFF
  const graphemeRegex = /[\u0B80-\u0BFF][\u0BBE-\u0BCD\u0BD7]*/g;
  const matches = text.match(graphemeRegex);
  return matches || text.split('');
}

// Levenshtein distance on grapheme clusters for accurate CER calculation
export interface CerDetails {
  cer: number; // 0 to 1+
  substitutions: number;
  deletions: number;
  insertions: number;
  totalRefCharacters: number;
}

export function calculateCER(hypothesis: string, reference: string): CerDetails {
  const hypGraphemes = getTamilGraphemes(hypothesis.trim().replace(/\s+/g, ' '));
  const refGraphemes = getTamilGraphemes(reference.trim().replace(/\s+/g, ' '));

  const n = refGraphemes.length;
  const m = hypGraphemes.length;

  if (n === 0) {
    return {
      cer: m === 0 ? 0 : 1,
      substitutions: 0,
      deletions: 0,
      insertions: m,
      totalRefCharacters: 0,
    };
  }

  // Cost matrix & operation tracking
  // dp[i][j] stores [cost, substitutions, deletions, insertions]
  const dp: Array<Array<[number, number, number, number]>> = Array(n + 1)
    .fill(null)
    .map(() => Array(m + 1).fill([0, 0, 0, 0]));

  for (let i = 0; i <= n; i++) {
    dp[i][0] = [i, 0, i, 0]; // i deletions from reference
  }
  for (let j = 0; j <= m; j++) {
    dp[0][j] = [j, 0, 0, j]; // j insertions into hypothesis
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const refChar = refGraphemes[i - 1];
      const hypChar = hypGraphemes[j - 1];

      if (refChar === hypChar) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // substitution
        const [subCost, sSub, sDel, sIns] = dp[i - 1][j - 1];
        // deletion
        const [delCost, dSub, dDel, dIns] = dp[i - 1][j];
        // insertion
        const [insCost, iSub, iDel, iIns] = dp[i][j - 1];

        const minCost = Math.min(subCost + 1, delCost + 1, insCost + 1);

        if (minCost === subCost + 1) {
          dp[i][j] = [minCost, sSub + 1, sDel, sIns];
        } else if (minCost === delCost + 1) {
          dp[i][j] = [minCost, dSub, dDel + 1, dIns];
        } else {
          dp[i][j] = [minCost, iSub, iDel, iIns + 1];
        }
      }
    }
  }

  const [, substitutions, deletions, insertions] = dp[n][m];
  const cer = (substitutions + deletions + insertions) / n;

  return {
    cer: Math.round(cer * 10000) / 10000,
    substitutions,
    deletions,
    insertions,
    totalRefCharacters: n,
  };
}

// Historical Tamil Lead-Type and Palm-Leaf Confusion Pairs
export const HISTORICAL_TAMIL_CONFUSIONS = [
  {
    type: 'missing_pulli',
    name: 'Faded / Dropped Virama (புள்ளி இழப்பு)',
    description: 'In 19th-century lead typography, the dot (்) atop consonants is easily rubbed off or uninked.',
    examples: ['க் ↔ க', 'த் ↔ த', 'ப் ↔ ப', 'ர் ↔ ர', 'ள் ↔ ள', 'ன் ↔ ன'],
  },
  {
    type: 'ligature_confusion',
    name: 'Vowel Sign "ா" vs Consonant "ர"',
    description: 'In early Tamil font casting, the right stroke for long "aa" (ா) resembles the consonant "ர".',
    examples: ['கா ↔ கர', 'தா ↔ தர', 'பா ↔ பர', 'வா ↔ வர'],
  },
  {
    type: 'nasal_confusion',
    name: 'Retroflex vs Alveolar Nasal (ண ↔ ன)',
    description: 'Faded loops in 100-year-old print can blur the 3-loop ண into 2-loop ன or vice-versa.',
    examples: ['கண்ணன் ↔ கன்னன்', 'மணம் ↔ மனம்', 'வண்ணம் ↔ வன்னம்'],
  },
  {
    type: 'lateral_confusion',
    name: 'Laterals & Rhotic Blurs (ள ↔ ழ ↔ ல)',
    description: 'Lead oxidation or low-resolution scan blurs central loops of ள, ழ, and ல.',
    examples: ['தமிழ்க் ↔ தமில்க்', 'பொருள் ↔ பொருல்', 'வாழ்வு ↔ வாள்வு'],
  },
  {
    type: 'broken_glyph',
    name: 'Broken Glyph or Bleed-Through Ink Blot (மைப் புள்ளியால் சிதைவு)',
    description: 'Ink bleed from the reverse page or damaged lead slug creates spurious dots or gaps.',
    examples: ['ய ↔ ப', 'ம ↔ ப', 'த ↔ சு', 'வ ↔ ச'],
  },
];

// Check if two Tamil words differ solely by plausible historical printing confusions
export function evaluatePlausibleGlyphConfusion(
  rawWord: string,
  candidateWord: string
): { isPlausible: boolean; rationale: string; category: string } {
  if (rawWord === candidateWord) {
    return { isPlausible: false, rationale: 'Identical word', category: 'identical' };
  }

  // Check 1: Missing or Spurious Pulli (Virama)
  // Strip pulli to see if base consonants match
  const rawNoPulli = rawWord.replace(/\u0BCD/g, '');
  const candNoPulli = candidateWord.replace(/\u0BCD/g, '');
  if (rawNoPulli === candNoPulli) {
    return {
      isPlausible: true,
      rationale: 'Differs solely by presence/absence of pulli (்). Characteristic of faded 19th-century lead type.',
      category: 'missing_pulli',
    };
  }

  // Check 2: 'ர' vs 'ா' confusion
  const rawNormalizedR = rawWord.replace(/ா/g, 'ர');
  const candNormalizedR = candidateWord.replace(/ா/g, 'ர');
  if (rawNormalizedR === candNormalizedR) {
    return {
      isPlausible: true,
      rationale: 'Characteristic lead-type ligature confusion between vowel sign ா and consonant ர.',
      category: 'ligature_confusion',
    };
  }

  // Check 3: ண vs ன confusion
  const rawNormalizedN = rawWord.replace(/ண/g, 'ன');
  const candNormalizedN = candidateWord.replace(/ண/g, 'ன');
  if (rawNormalizedN === candNormalizedN) {
    return {
      isPlausible: true,
      rationale: 'Loop erosion between retroflex ண and alveolar ன in weathered print.',
      category: 'nasal_confusion',
    };
  }

  // Check 4: Single grapheme substitution
  const rawGraphemes = getTamilGraphemes(rawWord);
  const candGraphemes = getTamilGraphemes(candidateWord);

  if (Math.abs(rawGraphemes.length - candGraphemes.length) <= 1) {
    const cer = calculateCER(rawWord, candidateWord);
    if (cer.substitutions <= 2 && cer.insertions <= 1 && cer.deletions <= 1) {
      return {
        isPlausible: true,
        rationale: `Minor edit distance (${cer.substitutions} sub, ${cer.deletions} del, ${cer.insertions} ins). Plausible local damage.`,
        category: 'minor_grapheme_edit',
      };
    }
  }

  return {
    isPlausible: false,
    rationale: 'Diverges significantly from raw OCR characters. High risk of AI hallucination.',
    category: 'unsupported_hallucination_risk',
  };
}

// Aligns extracted segment with reference text for scholarly diff comparison
export function alignWordsWithReference(extracted: string, reference: string) {
  const extWords = extracted.trim().split(/\s+/).filter(Boolean);
  const refWords = reference.trim().split(/\s+/).filter(Boolean);

  const aligned: Array<{
    originalWord: string;
    referenceWord: string;
    matchType: 'exact' | 'variant' | 'uncertain' | 'discrepancy' | 'ocr_error';
    evidenceNotes: string;
  }> = [];

  const maxLen = Math.max(extWords.length, refWords.length);
  for (let i = 0; i < maxLen; i++) {
    const orig = extWords[i] || '';
    const ref = refWords[i] || '';

    if (orig === ref && orig !== '') {
      aligned.push({
        originalWord: orig,
        referenceWord: ref,
        matchType: 'exact',
        evidenceNotes: 'Exact orthographic match across both sources.',
      });
    } else if (orig.includes('[') || orig.includes('?') || orig.includes('...')) {
      aligned.push({
        originalWord: orig,
        referenceWord: ref,
        matchType: 'uncertain',
        evidenceNotes: 'Original page contains damaged or unclear character; reference provides attested reading.',
      });
    } else if (orig && ref) {
      const confusion = evaluatePlausibleGlyphConfusion(orig, ref);
      if (confusion.isPlausible) {
        aligned.push({
          originalWord: orig,
          referenceWord: ref,
          matchType: 'ocr_error',
          evidenceNotes: `Plausible OCR degradation: ${confusion.rationale}`,
        });
      } else {
        aligned.push({
          originalWord: orig,
          referenceWord: ref,
          matchType: 'variant',
          evidenceNotes: 'Scholarly textual variant between manuscript editions or differing redactions.',
        });
      }
    } else {
      aligned.push({
        originalWord: orig || '∅ (omitted)',
        referenceWord: ref || '∅ (extra)',
        matchType: 'discrepancy',
        evidenceNotes: orig ? 'Extra token in OCR output not in reference.' : 'Token present in reference omitted by OCR.',
      });
    }
  }

  return aligned;
}
