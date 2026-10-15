import React, { useState } from 'react';
import {
  FileText,
  Lock,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Info,
  Check,
  X,
  Copy,
  Download,
  Loader2,
} from 'lucide-react';
import { DigitisationSession, TamilOcrToken } from '../types';

interface OcrWorkspaceViewProps {
  session: DigitisationSession;
  onUpdateSession: (updated: DigitisationSession) => void;
  onRunOcrAgain: () => Promise<void>;
  onInspectToken: (token: TamilOcrToken) => void;
  selectedTokenId: string | null;
  onQuickDecision: (
    tokenId: string,
    decision: 'accept' | 'reject' | 'mark_uncertain' | 'edit',
    customText?: string
  ) => void;
  isOcrRunning?: boolean;
}

export const OcrWorkspaceView: React.FC<OcrWorkspaceViewProps> = ({
  session,
  onUpdateSession,
  onRunOcrAgain,
  onInspectToken,
  selectedTokenId,
  onQuickDecision,
  isOcrRunning,
}) => {
  const [activeTab, setActiveTab] = useState<'interactive' | 'raw_locked' | 'reviewed_clean'>('interactive');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null);
  const [customEditText, setCustomEditText] = useState('');
  const [manualTextEditMode, setManualTextEditMode] = useState(false);
  const [manualEditedText, setManualEditedText] = useState(session.reviewedText || '');

  // Keep manual text in sync when session text updates
  React.useEffect(() => {
    setManualEditedText(session.reviewedText || '');
  }, [session.reviewedText]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const downloadTextFile = () => {
    const textToSave = session.reviewedText || session.rawOcrText;
    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tamilvault-ocr-${session.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveManualText = () => {
    onUpdateSession({
      ...session,
      reviewedText: manualEditedText,
      auditTrail: [
        ...session.auditTrail,
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          tokenId: 'manual-edit',
          originalReading: session.reviewedText,
          newReading: manualEditedText,
          action: 'edit',
          evidenceType: 'manual',
          evidenceDetails: 'Manual full-text review edit by human epigraphist.',
          operator: 'Human Epigraphist',
        },
      ],
    });
    setManualTextEditMode(false);
  };

  const selectedToken = session.tokens.find((t) => t.id === selectedTokenId);
  const hasExtractedText = session.rawOcrText && session.rawOcrText.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Tamil OCR Workspace
            </h2>
            <p className="text-xs text-slate-500">
              {session.isDemoSample ? (
                <span className="text-amber-700 font-medium">Historical Benchmark Demo: {session.title}</span>
              ) : (
                <span>Real Scan: {session.title} ({session.fileType === 'pdf' ? `PDF Page ${session.currentPage || 1}` : 'Uploaded Image'})</span>
              )}
            </p>
          </div>
        </div>

        {/* View Switchers, Rerun Button, and Download */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Re-run OCR */}
          <button
            onClick={onRunOcrAgain}
            disabled={isOcrRunning}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            {isOcrRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running Tesseract OCR...</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5" />
                <span>Run Real Tamil OCR</span>
              </>
            )}
          </button>

          {hasExtractedText && (
            <button
              onClick={downloadTextFile}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Download extracted Tamil text as UTF-8 TXT"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Download Text</span>
            </button>
          )}

          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

          {/* Typography Controls */}
          <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <span className="text-[11px] font-medium px-1">Size:</span>
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 2))}
              className="px-1.5 py-0.5 hover:bg-slate-200 rounded font-bold"
            >
              -
            </button>
            <span className="font-mono text-[11px] w-6 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize((s) => Math.min(32, s + 2))}
              className="px-1.5 py-0.5 hover:bg-slate-200 rounded font-bold"
            >
              +
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setFontFamily((f) => (f === 'serif' ? 'sans' : 'serif'))}
              className="px-2 py-0.5 text-[11px] font-medium hover:bg-slate-200 rounded"
            >
              {fontFamily === 'serif' ? 'Noto Serif' : 'Noto Sans'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual-Panel Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[650px]">
        {/* LEFT PANEL: Original Scanned Page Viewer */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-xs">
          {/* Scanned Image Toolbar */}
          <div className="bg-slate-800/90 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Uploaded Scan Preview
              </span>
              <span className="text-[11px] text-slate-400">
                ({session.fileType === 'pdf' ? `PDF Page ${session.currentPage || 1} of ${session.totalPages || 1}` : 'Image'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.2))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3.0, z + 0.2))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas / Image Display Container with pan/zoom */}
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950 relative">
            <div
              className="relative transition-transform duration-150 origin-top shadow-lg"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={session.enhancedImageUrl || session.originalImageUrl}
                alt="Uploaded Tamil Document Scan"
                className="max-h-[850px] w-auto object-contain rounded"
              />

              {/* Bounding box highlight overlays for actual suspicious tokens */}
              {session.tokens
                .filter((t) => t.isSuspicious && t.position.bbox)
                .map((token) => {
                  const isSelected = token.id === selectedTokenId;
                  const bbox = token.position.bbox!;
                  const imgW = session.imageDimensions?.width || 800;
                  const imgH = session.imageDimensions?.height || 1100;
                  return (
                    <div
                      key={token.id}
                      onClick={() => onInspectToken(token)}
                      style={{
                        position: 'absolute',
                        left: `${(bbox.x / imgW) * 100}%`,
                        top: `${(bbox.y / imgH) * 100}%`,
                        width: `${(bbox.width / imgW) * 100}%`,
                        height: `${(bbox.height / imgH) * 100}%`,
                      }}
                      className={`cursor-pointer rounded border-2 transition-all group ${
                        isSelected
                          ? 'border-blue-400 bg-blue-500/30 ring-2 ring-blue-300 animate-pulse'
                          : token.reviewStatus === 'human_verified'
                          ? 'border-emerald-500/70 bg-emerald-500/10'
                          : token.reviewStatus === 'uncertain'
                          ? 'border-amber-500/80 bg-amber-500/20'
                          : 'border-rose-500/70 bg-rose-500/15 hover:bg-rose-500/30'
                      }`}
                      title={`Inspect token '${token.originalText}' (${token.flagReason})`}
                    >
                      <span className="absolute -top-5 left-0 bg-slate-900 text-white text-[9px] px-1 rounded shadow-xs opacity-0 group-hover:opacity-100 transition-opacity font-mono whitespace-nowrap z-20">
                        {token.originalText} (Conf: {Math.round(token.ocrConfidence * 100)}%)
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Bottom helper tip */}
          <div className="bg-slate-900 px-4 py-2 text-[11px] text-slate-400 border-t border-slate-800 flex items-center justify-between">
            <span>
              {hasExtractedText
                ? `${session.tokens.length} words extracted from this image`
                : 'Awaiting OCR execution'}
            </span>
            <span className="text-slate-500">
              {session.tokens.filter((t) => t.isSuspicious).length} Flagged for Review
            </span>
          </div>
        </div>

        {/* RIGHT PANEL: Extracted Tamil Text & Isolation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-xs">
          {/* Tab Switcher */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('interactive')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'interactive'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                Interactive Review
              </button>
              <button
                onClick={() => setActiveTab('raw_locked')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'raw_locked'
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Raw OCR (Immutable)
              </button>
              <button
                onClick={() => setActiveTab('reviewed_clean')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviewed_clean'
                    ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Clean Verified Text
              </button>
            </div>

            <div className="flex items-center gap-1">
              {hasExtractedText && (
                <button
                  onClick={() => setManualTextEditMode(!manualTextEditMode)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                    manualTextEditMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  {manualTextEditMode ? 'Close Editor' : 'Edit Text'}
                </button>
              )}

              <button
                onClick={() => copyToClipboard(session.reviewedText || session.rawOcrText)}
                disabled={!hasExtractedText}
                className="text-xs text-slate-600 hover:text-blue-600 disabled:opacity-40 flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-200/60 transition-colors"
                title="Copy verified Tamil text to clipboard"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedNotice ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-5 overflow-auto">
            {/* If NO text has been extracted yet from this uploaded image */}
            {!hasExtractedText ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="max-w-md space-y-1">
                  <h3 className="font-bold text-slate-900 text-base font-serif">
                    Ready to Extract Tamil Text
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This file has been uploaded without any predefined or fake text. Click the button below to execute real Tesseract OCR on this scan.
                  </p>
                </div>
                <button
                  onClick={onRunOcrAgain}
                  disabled={isOcrRunning}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs py-2.5 px-5 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isOcrRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Image with OpenCV &amp; Tesseract...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Real Tamil OCR on This Image</span>
                    </>
                  )}
                </button>
              </div>
            ) : manualTextEditMode ? (
              /* Manual Full-Text Editor Mode */
              <div className="space-y-3 h-full flex flex-col">
                <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800 flex items-center justify-between">
                  <span>
                    Editing verified transcription. Changes will be added to the session's audit trail.
                  </span>
                  <button
                    onClick={handleSaveManualText}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1 rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
                <textarea
                  value={manualEditedText}
                  onChange={(e) => setManualEditedText(e.target.value)}
                  className={`w-full flex-1 p-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 leading-relaxed font-serif-tamil text-slate-900`}
                  style={{ fontSize: `${fontSize}px` }}
                />
              </div>
            ) : (
              /* TAB 1: INTERACTIVE REVIEW VIEW */
              activeTab === 'interactive' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong>Dynamic OCR Result:</strong> Real text extracted from your uploaded file. Click on any underlined or highlighted token to inspect its real confidence and evidence.
                    </div>
                  </div>

                  {/* Rendered Interactive Tokens */}
                  <div
                    className={`leading-loose whitespace-pre-wrap ${
                      fontFamily === 'serif' ? 'font-serif-tamil' : 'font-tamil'
                    }`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {session.tokens.length > 0 ? (
                      session.tokens.map((token) => {
                        const isSelected = token.id === selectedTokenId;
                        let badgeStyle = 'text-slate-800 hover:bg-slate-100';

                        if (token.isSuspicious) {
                          if (token.reviewStatus === 'human_verified') {
                            badgeStyle = 'bg-emerald-50 text-emerald-900 border-b-2 border-emerald-500 font-medium px-1 rounded-xs';
                          } else if (token.reviewStatus === 'uncertain') {
                            badgeStyle = 'bg-amber-100 text-amber-900 border-b-2 border-amber-600 font-bold px-1 rounded-xs';
                          } else if (token.reviewStatus === 'rejected') {
                            badgeStyle = 'line-through text-slate-400 px-1';
                          } else {
                            badgeStyle = 'bg-rose-50 text-rose-900 border-b-2 border-dashed border-rose-500 font-medium px-1 rounded-xs';
                          }
                        }

                        return (
                          <span key={token.id} className="inline-block mr-2 my-1">
                            <button
                              onClick={() => onInspectToken(token)}
                              className={`cursor-pointer transition-all ${badgeStyle} ${
                                isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                              }`}
                            >
                              {token.currentText}
                            </button>
                          </span>
                        );
                      })
                    ) : (
                      <div className="text-slate-800 font-serif-tamil leading-relaxed">
                        {session.reviewedText || session.rawOcrText}
                      </div>
                    )}
                  </div>

                  {/* Quick Decision Box for Selected Token */}
                  {selectedToken && (
                    <div className="mt-6 p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Selected Word:
                          </span>
                          <span className="font-serif-tamil font-bold text-lg text-slate-900">
                            {selectedToken.originalText}
                          </span>
                          {selectedToken.candidateText && (
                            <>
                              <span className="text-slate-400">&rarr;</span>
                              <span className="font-serif-tamil font-bold text-lg text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                {selectedToken.candidateText}
                              </span>
                            </>
                          )}
                        </div>

                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-200 text-slate-700">
                          Real OCR Conf: {Math.round(selectedToken.ocrConfidence * 100)}%
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 space-y-1">
                        <div>
                          <strong>Evaluation:</strong> {selectedToken.flagReason}
                        </div>
                        <div>
                          <strong>Visual Evidence:</strong> {selectedToken.visualEvidenceNotes}
                        </div>
                        {selectedToken.referenceEvidence && (
                          <div>
                            <strong>Reference Corpus:</strong>{' '}
                            <span className="text-blue-700 font-medium">{selectedToken.referenceEvidence.source}</span> —{' '}
                            {selectedToken.referenceEvidence.notes}
                          </div>
                        )}
                      </div>

                      {/* Quick Decision Actions */}
                      {editingTokenId === selectedToken.id ? (
                        <div className="pt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={customEditText}
                            onChange={(e) => setCustomEditText(e.target.value)}
                            placeholder="Type verified Tamil text..."
                            className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-serif-tamil focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => {
                              onQuickDecision(selectedToken.id, 'edit', customEditText);
                              setEditingTokenId(null);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTokenId(null)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-3 py-1.5 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {selectedToken.candidateText && (
                            <button
                              onClick={() => onQuickDecision(selectedToken.id, 'accept')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Accept Suggestion ({selectedToken.candidateText})
                            </button>
                          )}
                          <button
                            onClick={() => onQuickDecision(selectedToken.id, 'reject')}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject (Keep Original '{selectedToken.originalText}')
                          </button>
                          <button
                            onClick={() => onQuickDecision(selectedToken.id, 'mark_uncertain')}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 border border-amber-300"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                            Mark Uncertain [unclear]
                          </button>
                          <button
                            onClick={() => {
                              setEditingTokenId(selectedToken.id);
                              setCustomEditText(selectedToken.currentText);
                            }}
                            className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Word
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            )}

            {/* TAB 2: RAW OCR (IMMUTABLE RECORD) */}
            {hasExtractedText && activeTab === 'raw_locked' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Anti-Hallucination Isolation (Rule 1 &amp; 2):</strong> Raw Tesseract OCR output is permanently protected and locked. It is never overwritten by generative AI or corrections.
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm leading-relaxed text-slate-800 overflow-x-auto whitespace-pre-wrap font-serif-tamil">
                  {session.rawOcrText}
                </div>
              </div>
            )}

            {/* TAB 3: CLEAN VERIFIED OUTPUT */}
            {hasExtractedText && activeTab === 'reviewed_clean' && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Scholarly Archival Output:</strong> Verified text derived from your uploaded file, preserving genuine physical uncertainties as <code>{session.uncertaintyNotation}</code>.
                  </div>
                </div>

                <div
                  className={`p-4 bg-slate-50/50 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap text-slate-900 ${
                    fontFamily === 'serif' ? 'font-serif-tamil' : 'font-tamil'
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {session.reviewedText || session.rawOcrText}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
