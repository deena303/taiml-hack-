import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  XCircle,
  FileSearch,
  BookOpen,
  Eye,
  Check,
  X,
  Edit3,
  Filter,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { DigitisationSession, TamilOcrToken, ReviewStatus } from '../types';

interface AiCorrectionEngineViewProps {
  session: DigitisationSession;
  onUpdateSession: (updated: DigitisationSession) => void;
  onInspectToken: (token: TamilOcrToken) => void;
  onQuickDecision: (
    tokenId: string,
    decision: 'accept' | 'reject' | 'mark_uncertain' | 'edit',
    customText?: string
  ) => void;
}

export const AiCorrectionEngineView: React.FC<AiCorrectionEngineViewProps> = ({
  session,
  onUpdateSession,
  onInspectToken,
  onQuickDecision,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');

  const suspiciousTokens = session.tokens.filter((t) => t.isSuspicious);

  const filteredTokens = suspiciousTokens.filter((t) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'awaiting') return t.reviewStatus === 'unreviewed' || t.reviewStatus === 'suggested';
    if (filterStatus === 'verified') return t.reviewStatus === 'human_verified';
    if (filterStatus === 'uncertain') return t.reviewStatus === 'uncertain';
    if (filterStatus === 'rejected') return t.reviewStatus === 'rejected';
    return true;
  });

  // Batch action: Accept all with dual visual + reference evidence
  const handleBatchAcceptHighEvidence = () => {
    const highEvidenceTokens = session.tokens.filter(
      (t) =>
        t.isSuspicious &&
        t.reviewStatus !== 'human_verified' &&
        t.candidateText &&
        t.referenceEvidence?.isExactMatch &&
        t.visualEvidenceStatus === 'stroke_match'
    );

    highEvidenceTokens.forEach((tok) => {
      onQuickDecision(tok.id, 'accept');
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Anti-Hallucination Policy Alert */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                AI-Assisted Evidence &amp; Correction Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict multi-tier verification separates physical ink traces from statistical language model guesses.
            </p>
          </div>

          {/* Batch Review Action */}
          <button
            onClick={handleBatchAcceptHighEvidence}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Batch Accept High-Evidence Items
          </button>
        </div>

        {/* Guiding Principle Card */}
        <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Core Archival Mandate:</strong> Generative AI language probability or grammatical fluency is <em>never</em> treated as proof that a word existed in the 100-year-old book. Where visual evidence is destroyed or ambiguous, the word is flagged as <code className="bg-amber-100 font-mono px-1 py-0.5 rounded font-bold">{session.uncertaintyNotation}</code> to protect historical fidelity.
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by:
            </span>
            {[
              { id: 'all', label: `All Flagged (${suspiciousTokens.length})` },
              { id: 'awaiting', label: `Awaiting (${suspiciousTokens.filter((t) => t.reviewStatus === 'unreviewed' || t.reviewStatus === 'suggested').length})` },
              { id: 'verified', label: `Verified (${suspiciousTokens.filter((t) => t.reviewStatus === 'human_verified').length})` },
              { id: 'uncertain', label: `Uncertain [unclear] (${suspiciousTokens.filter((t) => t.reviewStatus === 'uncertain').length})` },
              { id: 'rejected', label: `Rejected (${suspiciousTokens.filter((t) => t.reviewStatus === 'rejected').length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterStatus === f.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            Showing {filteredTokens.length} of {suspiciousTokens.length} flagged items
          </span>
        </div>
      </div>

      {/* Cards List for Each Flagged Word */}
      {!session.rawOcrText ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <FileSearch className="w-8 h-8 text-blue-500 mx-auto" />
          <h3 className="font-semibold text-slate-800 text-sm">No OCR Text Available Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Upload a Tamil book scan and click "Run Real Tamil OCR" to dynamically extract text and identify suspicious or uncertain characters.
          </p>
        </div>
      ) : suspiciousTokens.length === 0 ? (
        <div className="bg-white rounded-xl border border-emerald-200 p-12 text-center text-emerald-800 space-y-3 bg-emerald-50/20">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">Document Evaluated: No Corrections Needed</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            All words extracted from this uploaded scan demonstrate high OCR confidence and sound Tamil orthography.
          </p>
        </div>
      ) : filteredTokens.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="font-semibold text-slate-800 text-sm">No tokens match this filter</h3>
          <p className="text-xs text-slate-500">All suspicious tokens have been reviewed or none are found under this status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTokens.map((token) => {
            const isEditing = editingTokenId === token.id;

            return (
              <div
                key={token.id}
                className={`bg-white rounded-xl border transition-all p-5 shadow-2xs space-y-4 ${
                  token.reviewStatus === 'human_verified'
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : token.reviewStatus === 'uncertain'
                    ? 'border-amber-300 bg-amber-50/20'
                    : token.reviewStatus === 'rejected'
                    ? 'border-slate-200 bg-slate-50/50 opacity-80'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Word Banner: Raw Reading -> Proposed Candidate */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Raw OCR:
                      </span>
                      <span className="font-serif-tamil font-bold text-xl text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {token.originalText}
                      </span>
                    </div>

                    <span className="text-slate-400 font-bold">&rarr;</span>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                        {token.candidateText ? 'Candidate:' : 'Refusal:'}
                      </span>
                      {token.candidateText ? (
                        <span className="font-serif-tamil font-bold text-xl text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                          {token.candidateText}
                        </span>
                      ) : (
                        <span className="font-mono text-sm text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300 font-bold">
                          [Refused AI Guess: Severe Damage]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badges: OCR Confidence & Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                      Conf: {Math.round(token.ocrConfidence * 100)}%
                    </span>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                        token.reviewStatus === 'human_verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : token.reviewStatus === 'uncertain'
                          ? 'bg-amber-100 text-amber-800'
                          : token.reviewStatus === 'rejected'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {token.reviewStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Flag Reason */}
                <div className="text-xs">
                  <span className="font-semibold text-slate-700">Flag Reason: </span>
                  <span className="text-slate-900 font-medium">{token.flagReason}</span>
                </div>

                {/* Three-Tier Evidence Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* 1. Visual Stroke Evidence */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        1. Visual Evidence
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">
                        {token.visualEvidenceStatus}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {token.visualEvidenceNotes}
                    </p>
                  </div>

                  {/* 2. Reference Corpus Evidence */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        2. Reference Corpus
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {token.referenceEvidence ? 'Attested' : 'Unattested'}
                      </span>
                    </div>
                    {token.referenceEvidence ? (
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        <strong className="text-slate-800">{token.referenceEvidence.source}:</strong>{' '}
                        {token.referenceEvidence.notes}
                      </p>
                    ) : (
                      <p className="text-slate-400 text-[11px] italic">
                        No direct match found in Classical Tamil Lexicon / CICT concordance.
                      </p>
                    )}
                  </div>

                  {/* 3. Context & Grammar Evidence */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-emerald-600" />
                        3. Grammatical Context
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {token.contextEvidence?.sandhiRule ? 'Sandhi' : 'General'}
                      </span>
                    </div>
                    {token.contextEvidence ? (
                      <div className="text-slate-600 text-[11px] leading-relaxed space-y-0.5">
                        {token.contextEvidence.sandhiRule && (
                          <div><strong>Sandhi:</strong> {token.contextEvidence.sandhiRule}</div>
                        )}
                        {token.contextEvidence.grammarRole && (
                          <div><strong>Role:</strong> {token.contextEvidence.grammarRole}</div>
                        )}
                        <div>{token.contextEvidence.notes}</div>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-[11px] italic">
                        Standard syntactic position; no metric irregularities.
                      </p>
                    )}
                  </div>
                </div>

                {/* Candidate Alternatives List (if multiple) */}
                {token.alternatives.length > 1 && (
                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-700 block mb-1">
                      Evaluated Candidate Readings:
                    </span>
                    <div className="space-y-1.5">
                      {token.alternatives.map((alt, aIdx) => (
                        <div key={aIdx} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-slate-100">
                          <span className="font-serif-tamil font-bold text-slate-900 text-sm">
                            {alt.text}
                          </span>
                          <span className="text-slate-600">{alt.rationale}</span>
                          <span className="font-mono text-slate-500">{Math.round(alt.confidence * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Human Review Decision Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                      <input
                        type="text"
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        placeholder="Type verified Tamil text..."
                        className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-serif-tamil flex-1 focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          onQuickDecision(token.id, 'edit', editInput);
                          setEditingTokenId(null);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                      >
                        Save Correction
                      </button>
                      <button
                        onClick={() => setEditingTokenId(null)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      {token.candidateText && (
                        <button
                          onClick={() => onQuickDecision(token.id, 'accept')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept ({token.candidateText})
                        </button>
                      )}

                      <button
                        onClick={() => onQuickDecision(token.id, 'reject')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject Suggestion
                      </button>

                      <button
                        onClick={() => onQuickDecision(token.id, 'mark_uncertain')}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                        title="Refuse to speculate; mark as [unclear]"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                        Mark as Uncertain [unclear]
                      </button>

                      <button
                        onClick={() => {
                          setEditingTokenId(token.id);
                          setEditInput(token.currentText);
                        }}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Manual Edit
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => onInspectToken(token)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 underline underline-offset-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect on Scanned Page
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
