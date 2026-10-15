import React from 'react';
import {
  BookOpen,
  Sliders,
  FileText,
  ShieldCheck,
  GitCompare,
  BarChart3,
  Download,
  Layers,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { DigitisationSession } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'upload-enhance'
  | 'ocr-workspace'
  | 'correction-engine'
  | 'reference-compare'
  | 'evaluation'
  | 'export'
  | 'architecture';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  sessions: DigitisationSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSessionClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSessionClick,
}) => {
  const currentSession = sessions.find((s) => s.id === currentSessionId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner: Archival Context & Anti-Hallucination Integrity */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Anti-Hallucination Protocol Active
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300">
            Conservative Policy: Unsupported AI guesses held as <code className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded text-[11px] font-mono">[unclear]</code>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px]">
            Inspiration:{' '}
            <span className="text-slate-300 font-medium">CICT Suvadi &amp; Digital Archives</span>
          </span>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setActiveTab('architecture')}
            className="hover:text-white transition-colors flex items-center gap-1 text-[11px] underline decoration-slate-600 underline-offset-2"
          >
            <Layers className="w-3 h-3 text-sky-400" />
            10 Anti-Hallucination Rules
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 font-serif font-bold text-xl tracking-tight">
            த
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
                TamilVault <span className="text-blue-600">AI</span>
              </h1>
              <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-200">
                Archival v1.0
              </span>
            </div>
            <p className="text-xs text-slate-700">
              தமிழ் நூல்கள் மற்றும் ஓலைச்சுவடிகள் மெய்ப்புப் பதிப்புத் தளம்
            </p>
          </div>
        </div>

        {/* Session Selector & Quick Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="relative inline-block text-left">
            <label className="text-[11px] text-slate-700 block font-medium mb-0.5">
              Active Digitisation Session
            </label>
            <div className="relative">
              <select
                aria-label="Active Digitisation Session"
                value={currentSessionId}
                onChange={(e) => onSelectSession(e.target.value)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs rounded-md pl-3 pr-8 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium max-w-[280px] sm:max-w-[340px] truncate shadow-2xs cursor-pointer"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.sourceMetadata.publicationYear || 'Archive'}) {s.isDemoSample ? '• Demo' : '• Live'}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={onNewSessionClick}
            className="mt-4 sm:mt-0 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md shadow-2xs hover:shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Digitise New Page
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar border-t border-slate-200/80 pt-1">
          {[
            { id: 'dashboard', label: 'Dashboard', tamil: 'முகப்பு', icon: BookOpen },
            { id: 'upload-enhance', label: 'Upload & Enhance', tamil: 'படிமம்', icon: Sliders },
            { id: 'ocr-workspace', label: 'Tamil OCR Workspace', tamil: 'எழுத்துணரி', icon: FileText },
            { id: 'correction-engine', label: 'Evidence Engine', tamil: 'சான்று ஆய்வு', icon: ShieldCheck },
            { id: 'reference-compare', label: 'Reference Compare', tamil: 'செம்மொழி ஒப்பீடு', icon: GitCompare },
            { id: 'evaluation', label: 'CER Evaluation', tamil: 'மதிப்பீடு', icon: BarChart3 },
            { id: 'export', label: 'Export & Report', tamil: 'பதிவிறக்கம்', icon: Download },
            { id: 'architecture', label: 'Architecture', tamil: 'கட்டமைப்பு', icon: Layers },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'border-transparent text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                <span className="text-[10px] text-slate-500 hidden lg:inline font-tamil">
                  ({item.tamil})
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
