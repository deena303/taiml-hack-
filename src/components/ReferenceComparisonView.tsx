import React, { useState } from 'react';
import {
  GitCompare,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Plus,
  RefreshCw,
  Info,
  Layers,
} from 'lucide-react';
import { DigitisationSession, ReferenceComparison } from '../types';
import { CLASSICAL_CORPORA, ClassicalCorpusItem } from '../data/classicalCorpora';
import { alignWordsWithReference, calculateCER } from '../utils/tamilLanguage';

interface ReferenceComparisonViewProps {
  session: DigitisationSession;
  onUpdateSession: (updated: DigitisationSession) => void;
}

export const ReferenceComparisonView: React.FC<ReferenceComparisonViewProps> = ({
  session,
  onUpdateSession,
}) => {
  const [selectedCorpusId, setSelectedCorpusId] = useState<string>(CLASSICAL_CORPORA[0].id);
  const [customReferenceTitle, setCustomReferenceTitle] = useState('');
  const [customReferenceSource, setCustomReferenceSource] = useState('');
  const [customReferenceText, setCustomReferenceText] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Active reference comparison
  const selectedCorpus = CLASSICAL_CORPORA.find((c) => c.id === selectedCorpusId);

  const activeReferenceText = isAddingCustom
    ? customReferenceText
    : selectedCorpus?.text || '';

  const activeReferenceSource = isAddingCustom
    ? customReferenceSource || 'Custom Reference Text'
    : selectedCorpus?.sourceEdition || 'CICT Classical Reference Corpus';

  // Perform live word-level alignment between session's reviewed text and active reference text
  const extractedText = session.reviewedText || session.rawOcrText;
  const alignedWords = alignWordsWithReference(extractedText, activeReferenceText);
  const cerMetric = calculateCER(extractedText, activeReferenceText);

  // Count matches & variants
  const exactCount = alignedWords.filter((w) => w.matchType === 'exact').length;
  const variantCount = alignedWords.filter((w) => w.matchType === 'variant').length;
  const ocrErrorCount = alignedWords.filter((w) => w.matchType === 'ocr_error').length;
  const uncertainCount = alignedWords.filter((w) => w.matchType === 'uncertain').length;

  return (
    <div className="space-y-6">
      {/* Header & Scholarly Ethics */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Reference Text Comparison &amp; Collation
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare extracted Tamil passages against canonical editions to identify textual variants and OCR misreads.
            </p>
          </div>

          {/* Reference Selector */}
          <div className="flex items-center gap-2">
            <select
              value={isAddingCustom ? 'custom' : selectedCorpusId}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setIsAddingCustom(true);
                } else {
                  setIsAddingCustom(false);
                  setSelectedCorpusId(e.target.value);
                }
              }}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-blue-500"
            >
              {CLASSICAL_CORPORA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.workTitle} — {c.section}
                </option>
              ))}
              <option value="custom">+ Paste Custom Scholarly Reference Text...</option>
            </select>
          </div>
        </div>

        {/* Ethical Disclaimer Card */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Info className="w-4 h-4 text-blue-600" />
            Scholarly Principle of Collation:
          </div>
          <p className="leading-relaxed text-[11px]">
            A reference match strongly supports a candidate reading but <strong>does not automatically prove</strong> that this specific 100-year-old scanned edition contains that exact word. Differing readings may reflect genuine historical manuscript recensions or regional typographical variations.
          </p>
        </div>
      </div>

      {/* Custom Reference Input if enabled */}
      {isAddingCustom && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-blue-600" />
            Add Custom Reference Collation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <input
              type="text"
              placeholder="Work Title (e.g., சிலப்பதிகாரம் - புகார்க் காண்டம்)"
              value={customReferenceTitle}
              onChange={(e) => setCustomReferenceTitle(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
            />
            <input
              type="text"
              placeholder="Source Edition (e.g., கழக வெளியீடு 1942 / Saraswathi Mahal Ms #110)"
              value={customReferenceSource}
              onChange={(e) => setCustomReferenceSource(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
            />
          </div>
          <textarea
            rows={4}
            placeholder="Paste canonical Tamil reference passage here in UTF-8..."
            value={customReferenceText}
            onChange={(e) => setCustomReferenceText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs font-serif-tamil focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Comparison Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block mb-1">Exact Word Matches</span>
          <span className="text-xl font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {exactCount}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block mb-1">Plausible OCR Degradation</span>
          <span className="text-xl font-bold text-rose-600 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            {ocrErrorCount}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block mb-1">Textual Variants</span>
          <span className="text-xl font-bold text-blue-600 flex items-center gap-1">
            <GitCompare className="w-4 h-4" />
            {variantCount}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block mb-1">Character Error Rate (CER)</span>
          <span className="text-xl font-bold text-slate-800 font-mono">
            {Math.round(cerMetric.cer * 1000) / 10}%
          </span>
        </div>
      </div>

      {/* Side-by-Side Collation Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Scanned Page Extracted Transcription */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Scanned Page Extracted Reading ({session.title})
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Current Workspace</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-slate-900 font-serif-tamil text-sm leading-relaxed whitespace-pre-wrap min-h-[220px]">
            {extractedText}
          </div>
        </div>

        {/* Right: Attested Canonical Reference Edition */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Attested Canonical Reference Edition
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {activeReferenceSource}
            </span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-slate-900 font-serif-tamil text-sm leading-relaxed whitespace-pre-wrap min-h-[220px]">
            {activeReferenceText}
          </div>
        </div>
      </div>

      {/* Word-by-Word Alignment & Textual Variant Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          Word-by-Word Collation Alignment &amp; Evidence Notes
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider bg-slate-50">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Scanned Edition Token</th>
                <th className="py-2.5 px-3">Reference Edition Token</th>
                <th className="py-2.5 px-3">Match Classification</th>
                <th className="py-2.5 px-3">Scholarly Evidence Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-tamil">
              {alignedWords.map((row, idx) => {
                let badgeClass = 'bg-slate-100 text-slate-700';
                if (row.matchType === 'exact') badgeClass = 'bg-emerald-100 text-emerald-800';
                else if (row.matchType === 'ocr_error') badgeClass = 'bg-rose-100 text-rose-800';
                else if (row.matchType === 'variant') badgeClass = 'bg-blue-100 text-blue-800';
                else if (row.matchType === 'uncertain') badgeClass = 'bg-amber-100 text-amber-800';

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{row.originalWord}</td>
                    <td className="py-2 px-3 font-bold text-blue-700">{row.referenceWord}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeClass}`}>
                        {row.matchType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-[11px] font-sans">
                      {row.evidenceNotes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
