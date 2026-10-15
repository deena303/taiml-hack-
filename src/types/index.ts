export type SourceType =
  | 'printed_19th_c'
  | 'palm_leaf_lithograph'
  | 'early_press_20th_c'
  | 'user_upload';

export type ReviewStatus =
  | 'unreviewed'
  | 'suggested'
  | 'supported_by_visual'
  | 'supported_by_reference'
  | 'human_verified'
  | 'uncertain'
  | 'rejected';

export type VisualEvidenceStatus =
  | 'stroke_match'
  | 'partial_damage'
  | 'severe_damage'
  | 'faded_ink'
  | 'ink_blot'
  | 'manual_inspection_needed';

export interface CandidateAlternative {
  text: string;
  confidence: number;
  evidenceType: 'visual' | 'reference' | 'context' | 'lexical';
  rationale: string;
  isPlausibleGlyphConfusion: boolean;
}

export interface TamilOcrToken {
  id: string;
  wordIndex: number;
  originalText: string;
  currentText: string;
  candidateText?: string;
  alternatives: CandidateAlternative[];
  position: {
    line: number;
    wordNumber: number;
    charStart: number;
    charEnd: number;
    bbox?: { x: number; y: number; width: number; height: number };
  };
  ocrConfidence: number; // 0 to 1
  isSuspicious: boolean;
  flagReason: string;
  visualEvidenceStatus: VisualEvidenceStatus;
  visualEvidenceNotes: string;
  referenceEvidence?: {
    source: string;
    matchedReading: string;
    similarity: number;
    notes: string;
    isExactMatch: boolean;
  };
  contextEvidence?: {
    sandhiRule?: string;
    grammarRole?: string;
    notes: string;
  };
  reviewStatus: ReviewStatus;
  reviewerDecision?: 'accepted' | 'rejected' | 'custom_edited' | 'marked_uncertain';
  uncertainPlaceholder: string; // e.g. '[unclear]', '[சிதைவு]', '[ஐயம்]', '...'
  cropCoordinates?: { x: number; y: number; w: number; h: number };
  changeHistory: Array<{
    timestamp: string;
    fromText: string;
    toText: string;
    action: string;
    evidenceUsed: string[];
    notes?: string;
  }>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  tokenId: string;
  originalReading: string;
  newReading: string;
  action: 'accept' | 'reject' | 'edit' | 'mark_uncertain' | 'batch_accept';
  evidenceType: 'visual' | 'reference' | 'context' | 'manual' | 'none';
  evidenceDetails: string;
  operator: string;
}

export interface ReferenceComparison {
  id: string;
  title: string;
  source: string;
  referenceText: string;
  extractedSegment: string;
  alignedWords: Array<{
    originalWord: string;
    referenceWord: string;
    matchType: 'exact' | 'variant' | 'uncertain' | 'discrepancy' | 'ocr_error';
    evidenceNotes: string;
  }>;
  cer: number;
}

export interface EnhancementSettings {
  brightness: number; // -100 to 100
  contrast: number;   // -100 to 100
  grayscale: boolean;
  denoising: boolean;
  thresholdMode: 'none' | 'otsu' | 'sauvola' | 'adaptive';
  thresholdValue: number; // 0 to 255
  invert: boolean;
}

export interface EvaluationMetrics {
  referenceTranscriptionAvailable: boolean;
  rawOcrCer: number | null;
  reviewedCer: number | null;
  characterSubstitutions: number;
  characterDeletions: number;
  characterInsertions: number;
  totalReferenceCharacters: number;
  correctionsAccepted: number;
  correctionsRejected: number;
  uncertainWordsCount: number;
  assistedPrecision: number | null;
  hallucinationPreventionScore: number; // % of unevidenced guesses stopped
}

export interface DigitisationSession {
  id: string;
  title: string;
  pageNumber: number;
  sourceType: SourceType;
  sourceMetadata: {
    publicationYear?: number;
    author?: string;
    commentary?: string;
    publisher?: string;
    edition?: string;
    physicalCondition: string;
    archiveReference?: string;
  };
  originalImageUrl: string;
  enhancedImageUrl?: string;
  enhancementSettings: EnhancementSettings;
  ocrEngine: string;
  ocrTimestamp: string;
  rawOcrText: string;
  reviewedText: string;
  tokens: TamilOcrToken[];
  referenceComparisons: ReferenceComparison[];
  groundTruthText?: string;
  auditTrail: AuditLogEntry[];
  evaluation?: EvaluationMetrics;
  uncertaintyNotation: string; // e.g., '[unclear]', '[சிதைவு]', '[ஐயம்]', '...'
  isDemoSample: boolean;
  totalPages?: number;
  currentPage?: number;
  filePath?: string;
  fileType?: string;
  isProcessing?: boolean;
  processingStage?: string;
  imageDimensions?: { width: number; height: number };
}
