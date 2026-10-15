import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  HelpCircle,
  Edit3,
  Eye,
  ShieldCheck,
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from 'lucide-react';
import { TamilOcrToken, DigitisationSession } from '../types';

interface HumanReviewModalProps {
  token: TamilOcrToken | null;
  session: DigitisationSession;
  onClose: () => void;
  onDecision: (
    tokenId: string,
    decision: 'accept' | 'reject' | 'mark_uncertain' | 'edit',
    customText?: string
  ) => void;
  onSelectToken: (token: TamilOcrToken) => void;
}

export const HumanReviewModal: React.FC<HumanReviewModalProps> = ({
  token,
  session,
  onClose,
  onDecision,
  onSelectToken,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState('');

  const suspiciousTokens = session.tokens.filter((t) => t.isSuspicious);
  const currentIndex = token ? suspiciousTokens.findIndex((t) => t.id === token.id) : -1;

  useEffect(() => {
    if (token) {
      setCustomText(token.currentText);
      setIsEditing(false);
    }
  }, [token]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!token || isEditing) return;
      if (e.key === 'a' || e.key === 'A') {
        if (token.candidateText) onDecision(token.id, 'accept');
      } else if (e.key === 'r' || e.key === 'R') {
        onDecision(token.id, 'reject');
      } else if (e.key === 'u' || e.key === 'U') {
        onDecision(token.id, 'mark_uncertain');
      } else if (e.key === 'e' || e.key === 'E') {
        setIsEditing(true);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && currentIndex < suspiciousTokens.length - 1) {
        onSelectToken(suspiciousTokens[currentIndex + 1]);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelectToken(suspiciousTokens[currentIndex - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [token, isEditing, currentIndex, suspiciousTokens, onDecision, onSelectToken, onClose]);

  if (!token) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm font-serif">
              Epigraphic Inspection &amp; Evidence Review
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({currentIndex + 1} of {suspiciousTokens.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => currentIndex > 0 && onSelectToken(suspiciousTokens[currentIndex - 1])}
              disabled={currentIndex <= 0}
              className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-300"
              title="Previous flagged token (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                currentIndex < suspiciousTokens.length - 1 &&
                onSelectToken(suspiciousTokens[currentIndex + 1])
              }
              disabled={currentIndex >= suspiciousTokens.length - 1}
              className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-300"
              title="Next flagged token (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Zoomed Word Inspection Display */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Raw Scanned OCR Reading:
              </span>
              <div className="font-serif-tamil text-2xl font-bold text-slate-900">
                {token.originalText}
              </div>
            </div>

            <div className="text-slate-400 font-bold text-xl hidden sm:block">&rarr;</div>

            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block mb-1">
                {token.candidateText ? 'Evidence-Backed Candidate:' : 'Refusal Status:'}
              </span>
              {token.candidateText ? (
                <div className="font-serif-tamil text-2xl font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 inline-block">
                  {token.candidateText}
                </div>
              ) : (
                <div className="font-mono text-sm font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300 inline-block">
                  [Refused to Guess: Character Missing]
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                OCR Confidence:
              </span>
              <span className="font-mono font-bold text-base text-slate-800">
                {Math.round(token.ocrConfidence * 100)}%
              </span>
            </div>
          </div>

          {/* Tri-Partite Evidence Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              Corroborating Evidence Analysis
            </h4>

            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-800">1. Physical Visual Traces:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {token.visualEvidenceNotes}
              </p>
            </div>

            {token.referenceEvidence && (
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-800">2. Reference Corpus Attestation:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong className="text-blue-700">{token.referenceEvidence.source}:</strong>{' '}
                  {token.referenceEvidence.notes}
                </p>
              </div>
            )}

            {token.contextEvidence && (
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-800">3. Syntactic &amp; Sandhi Grammar:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {token.contextEvidence.sandhiRule && (
                    <span className="block font-medium">{token.contextEvidence.sandhiRule}</span>
                  )}
                  {token.contextEvidence.notes}
                </p>
              </div>
            )}
          </div>

          {/* Custom Edit Box if toggled */}
          {isEditing && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="font-semibold text-slate-700 block">
                Type Verified Tamil Text (Custom Epigraphist Edit):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 font-serif-tamil text-base focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => {
                    onDecision(token.id, 'edit', customText);
                    setIsEditing(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer with Keyboard Shortcut Badges */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {token.candidateText && (
              <button
                onClick={() => onDecision(token.id, 'accept')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-2xs"
              >
                <Check className="w-4 h-4" />
                Accept Candidate <kbd className="bg-emerald-800/80 text-[10px] px-1 py-0.5 rounded font-mono">A</kbd>
              </button>
            )}

            <button
              onClick={() => onDecision(token.id, 'reject')}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5"
            >
              Reject Suggestion <kbd className="bg-slate-300 text-[10px] px-1 py-0.5 rounded font-mono">R</kbd>
            </button>

            <button
              onClick={() => onDecision(token.id, 'mark_uncertain')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              Mark [unclear] <kbd className="bg-amber-200 text-[10px] px-1 py-0.5 rounded font-mono">U</kbd>
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium px-3 py-2 rounded-lg flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit <kbd className="bg-slate-100 text-[10px] px-1 py-0.5 rounded font-mono">E</kbd>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
