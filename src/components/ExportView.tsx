import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Printer,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Copy,
  Clock,
  Layers,
} from 'lucide-react';
import { DigitisationSession } from '../types';

interface ExportViewProps {
  session: DigitisationSession;
  onUpdateSession: (updated: DigitisationSession) => void;
}

export const ExportView: React.FC<ExportViewProps> = ({
  session,
  onUpdateSession,
}) => {
  const [selectedNotation, setSelectedNotation] = useState(session.uncertaintyNotation || '[unclear]');
  const [copiedTxt, setCopiedTxt] = useState(false);

  // Update session notation and replace in reviewed text
  const handleNotationChange = (newNotation: string) => {
    setSelectedNotation(newNotation);
    const updatedReviewed = session.reviewedText.replace(/\[unclear\]|\[சிதைவு\]|\[ஐயம்\]|\[\.\.\.\]|\[\?\]/g, newNotation);
    onUpdateSession({
      ...session,
      uncertaintyNotation: newNotation,
      reviewedText: updatedReviewed,
    });
  };

  // Download UTF-8 TXT file
  const downloadTxt = () => {
    const blob = new Blob([session.reviewedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tamilvault-${session.id}-transcription.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Archival Audit Trail as CSV
  const downloadCsv = () => {
    let csv = 'Timestamp,TokenID,OriginalReading,NewReading,Decision,EvidenceType,Details,Operator\n';
    session.auditTrail.forEach((a) => {
      csv += `"${a.timestamp}","${a.tokenId}","${a.originalReading.replace(/"/g, '""')}","${a.newReading.replace(/"/g, '""')}","${a.action}","${a.evidenceType}","${a.evidenceDetails.replace(/"/g, '""')}","${a.operator}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tamilvault-${session.id}-audit-trail.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Comprehensive JSON Archival Package
  const downloadJson = () => {
    const pkg = {
      archiveMetadata: {
        application: 'TamilVault AI',
        specificationVersion: '1.0.0-archival',
        antiHallucinationEnforced: true,
        uncertaintyStandard: selectedNotation,
        exportedAt: new Date().toISOString(),
      },
      session,
    };
    const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tamilvault-${session.id}-archival-package.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyText = () => {
    navigator.clipboard.writeText(session.reviewedText);
    setCopiedTxt(true);
    setTimeout(() => setCopiedTxt(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Archival Export &amp; Audit Certificate
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Export verified transcriptions, preserved uncertainty tokens, and timestamped epigraphic audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Ready for Scholarly Publishing
            </span>
          </div>
        </div>
      </div>

      {/* Uncertainty Placeholder Configuration (Rule 7) */}
      <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-2xs space-y-3 bg-gradient-to-r from-white via-amber-50/20 to-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Uncertainty Notation Configuration (Rule 7)
            </h3>
          </div>
          <span className="text-[11px] text-amber-800">
            Never silently deleted from the final export
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          When physical ink or paper damage prevents a defensible reading, how should unresolved tokens appear in your final published transcription?
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[
            { id: '[unclear]', label: '[unclear]', desc: 'Digital Humanities English Standard' },
            { id: '[சிதைவு]', label: '[சிதைவு]', desc: 'Classical Tamil Epigraphy (Sithaivu)' },
            { id: '[ஐயம்]', label: '[ஐயம்]', desc: 'Scholarly Doubt (Aiyam)' },
            { id: '[...]', label: '[...]', desc: 'Bracketed Ellipsis' },
            { id: '[?]', label: '[?]', desc: 'Simple Query Mark' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNotationChange(item.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left border ${
                selectedNotation === item.id
                  ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold ring-2 ring-amber-400/30'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="font-mono text-sm font-bold text-amber-900">{item.label}</div>
              <div className="text-[10px] text-slate-500">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Export Format Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. UTF-8 TXT */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Plain Text Transcription (.txt)</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Clean Unicode UTF-8 text containing all verified words and marked uncertainties (<code>{selectedNotation}</code>).
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={downloadTxt}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download TXT
            </button>
            <button
              onClick={copyText}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-2 rounded-lg"
              title="Copy to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. CSV Audit Log */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Full Audit Trail (.csv)</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Complete chronological audit trail with original reading, new reading, evidence type, and reviewer decision.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={downloadCsv}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Audit CSV
            </button>
          </div>
        </div>

        {/* 3. Archival JSON Package */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <FileJson className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Archival JSON Package (.json)</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Complete session bundle including raw OCR text, image filter settings, token bounding boxes, and CER scores.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={downloadJson}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download JSON Package
            </button>
          </div>
        </div>
      </div>

      {/* Academic Digitisation Certificate & Preview Report */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-serif">
              Archival Digitisation Report Preview
            </h3>
            <span className="text-xs text-slate-500">
              Verified for Historical &amp; Epigraphic Research
            </span>
          </div>

          <button
            onClick={() => window.print()}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>

        {/* Certificate Body */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 text-xs">
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="font-serif font-bold text-base text-slate-900">
              TAMILVAULT AI — ARCHIVAL DIGITISATION CERTIFICATE
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Ref: {session.sourceMetadata.archiveReference || `TVLT-${session.id}`} • Timestamp: {new Date().toUTCString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500 block mb-0.5">Work Title &amp; Page:</span>
              <span className="font-serif-tamil font-bold text-slate-800 text-sm">
                {session.title} (Page {session.pageNumber})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Publication &amp; Year:</span>
              <span className="font-medium text-slate-800">
                {session.sourceMetadata.publisher} ({session.sourceMetadata.publicationYear})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">OCR Engine:</span>
              <span className="font-medium text-slate-800">{session.ocrEngine}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Raw OCR CER vs Reviewed CER:</span>
              <span className="font-mono font-bold text-slate-800">
                {session.evaluation?.rawOcrCer ? `${(session.evaluation.rawOcrCer * 100).toFixed(2)}%` : 'N/A'} &rarr;{' '}
                <span className="text-emerald-700 font-bold">
                  {session.evaluation?.reviewedCer ? `${(session.evaluation.reviewedCer * 100).toFixed(2)}%` : 'N/A'}
                </span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 font-medium block mb-1">Final Verified Transcription:</span>
            <div className="bg-white p-3 rounded-lg border border-slate-200 font-serif-tamil text-sm leading-relaxed whitespace-pre-wrap text-slate-900">
              {session.reviewedText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
