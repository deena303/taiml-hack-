import React from 'react';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  BookMarked,
  Sparkles,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { DigitisationSession } from '../types';
import { ActiveTab } from './Header';

interface DashboardViewProps {
  sessions: DigitisationSession[];
  currentSession: DigitisationSession;
  onSelectSession: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onNewSessionClick: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sessions,
  currentSession,
  onSelectSession,
  setActiveTab,
  onNewSessionClick,
}) => {
  // Aggregate metrics from real session state
  const totalPages = sessions.length;
  const totalWords = sessions.reduce((acc, s) => acc + s.tokens.length, 0);
  const totalAwaitingReview = sessions.reduce(
    (acc, s) => acc + s.tokens.filter((t) => t.isSuspicious && t.reviewStatus === 'unreviewed').length,
    0
  );
  const totalVerified = sessions.reduce(
    (acc, s) => acc + s.tokens.filter((t) => t.reviewStatus === 'human_verified').length,
    0
  );
  const totalUncertain = sessions.reduce(
    (acc, s) => acc + s.tokens.filter((t) => t.reviewStatus === 'uncertain').length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Hero / Introduction Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs px-3 py-1 rounded-full mb-3 backdrop-blur-xs">
            <Shield className="w-3.5 h-3.5 text-blue-300" />
            <span>Digital Humanities &amp; Classical Tamil Archival Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight mb-2">
            Preserving 100-Year-Old Tamil Texts Without AI Hallucinations
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5">
            Old Tamil books suffer from faded lead type, damaged paper, and dropped virama dots (்).
            Standard GenAI systems frequently invent words that never existed in historical manuscripts.
            TamilVault AI enforces <strong>evidence-grounded verification</strong>: when evidence is insufficient,
            uncertainty is preserved rather than fabricated.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewSessionClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all hover:translate-y-[-1px]"
            >
              <Sparkles className="w-4 h-4" />
              Digitise a New Page
            </button>
            <button
              onClick={() => setActiveTab('ocr-workspace')}
              className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-white/20 flex items-center gap-2 transition-all"
            >
              Open Current Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-slate-300 hover:text-white text-xs sm:text-sm px-3 py-2 flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              View 10 Anti-Hallucination Rules
            </button>
          </div>
        </div>

        {/* Decorative background watermark in Tamil typography */}
        <div className="absolute right-[-20px] bottom-[-40px] text-[200px] font-serif font-black text-white/5 select-none pointer-events-none">
          தமிழ்
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Pages */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Pages Processed</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalPages}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {sessions.filter((s) => s.isDemoSample).length} Demo / {sessions.filter((s) => !s.isDemoSample).length} Live
          </div>
        </div>

        {/* Total Words */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Words Extracted</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
              <BookMarked className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalWords}</div>
          <div className="text-[11px] text-slate-500 mt-1">Tamil Unicode Graphemes</div>
        </div>

        {/* Awaiting Review */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Awaiting Review</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{totalAwaitingReview}</div>
          <div className="text-[11px] text-slate-500 mt-1">Flagged for human eyes</div>
        </div>

        {/* Verified Corrections */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Verified Corrections</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{totalVerified}</div>
          <div className="text-[11px] text-slate-500 mt-1">Evidence confirmed</div>
        </div>

        {/* Uncertain Tokens Preserved */}
        <div className="col-span-2 lg:col-span-1 bg-white rounded-xl p-4 border border-amber-200 shadow-2xs hover:border-amber-300 transition-colors bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-900">Held as [unclear]</span>
            <span className="p-1.5 bg-amber-100 text-amber-700 rounded-md">
              <HelpCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-800">{totalUncertain}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            Hallucination Refused
          </div>
        </div>
      </div>

      {/* Main Content Layout: Active Session Spotlight & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Session Card & Workflow Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Session Spotlight */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Currently Loaded in Workspace
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-serif mt-0.5">
                  {currentSession.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentSession.sourceMetadata.publisher} • {currentSession.sourceMetadata.publicationYear} • Page {currentSession.pageNumber}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  currentSession.isDemoSample
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {currentSession.isDemoSample ? 'Authentic Benchmark Sample' : 'Live User Upload'}
                </span>
              </div>
            </div>

            {/* Condition & Technical Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium block mb-1">Physical Condition Notes:</span>
                <span className="text-slate-800 font-tamil leading-relaxed">
                  {currentSession.sourceMetadata.physicalCondition}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium block mb-1">OCR Engine:</span>
                <span className="text-slate-800 font-medium block mb-1">{currentSession.ocrEngine}</span>
                <span className="text-slate-500">Timestamp: {new Date(currentSession.ocrTimestamp).toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Actions for Active Session */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => setActiveTab('ocr-workspace')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Inspect OCR Workspace
              </button>
              <button
                onClick={() => setActiveTab('upload-enhance')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Adjust Enhancement Filters
              </button>
              <button
                onClick={() => setActiveTab('correction-engine')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Review Flagged Tokens ({currentSession.tokens.filter(t => t.isSuspicious).length})
              </button>
              <button
                onClick={() => setActiveTab('reference-compare')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Compare Reference
              </button>
            </div>
          </div>

          {/* Workflow Guide */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              The 5-Step Digitisation Pipeline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { step: '01', title: 'Upload & Ingest', desc: 'Preserves raw scan without lossy compression' },
                { step: '02', title: 'Sauvola Filter', desc: 'Binarizes faded ink and suppresses paper aging' },
                { step: '03', title: 'Raw OCR', desc: 'Extracts Tamil characters with permanent raw lock' },
                { step: '04', title: 'Anti-Hallucination', desc: 'Generates evidence-backed candidates only' },
                { step: '05', title: 'Human Review', desc: 'Epigraphist verifies, rejects, or marks [unclear]' },
              ].map((s) => (
                <div key={s.step} className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <span className="text-blue-600 font-bold text-xs font-mono block mb-1">{s.step}</span>
                  <div className="text-xs font-semibold text-slate-800 mb-0.5">{s.title}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Sessions Queue & Reference Inspiration */}
        <div className="space-y-6">
          {/* Recent Sessions List */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900">Archival Sessions</h4>
              <span className="text-[11px] text-slate-500 font-mono">
                {sessions.length} Available
              </span>
            </div>

            <div className="space-y-2.5">
              {sessions.map((s) => {
                const isSelected = s.id === currentSession.id;
                const suspicious = s.tokens.filter((t) => t.isSuspicious).length;
                return (
                  <div
                    key={s.id}
                    onClick={() => onSelectSession(s.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 truncate max-w-[200px]">
                        {s.title}
                      </span>
                      {s.isDemoSample && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          Sample
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Year: {s.sourceMetadata.publicationYear || 'N/A'} • {s.tokens.length} words
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100">
                      <span className="text-amber-700 font-medium">
                        {suspicious} Flagged words
                      </span>
                      <span className="text-blue-600 font-medium hover:underline flex items-center gap-0.5">
                        Open &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reference Inspiration Notice */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              Reference Inspiration &amp; Ethics
            </div>
            <p className="leading-relaxed text-[11px]">
              Inspired by the classical digitisation efforts of the Central Institute of Classical Tamil (CICT):
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
              <li>
                <a
                  href="https://suvadi.cict.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  CICT Suvadi Palm-leaf Archive
                </a>
              </li>
              <li>
                <a
                  href="https://www.digitalarchives.cict.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  CICT Digital Archives
                </a>
              </li>
            </ul>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 italic">
              Note: TamilVault AI operates independently. Live protected institutional databases are not scraped without explicit API credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
