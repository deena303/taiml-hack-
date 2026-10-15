import React from 'react';
import {
  ShieldCheck,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileText,
  Eye,
  BookOpen,
  GitCompare,
  Download,
  HelpCircle,
  X,
} from 'lucide-react';

interface ArchitectureModalProps {
  onClose?: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose }) => {
  const rules = [
    {
      num: 1,
      title: 'Preserve Original Scanned Image and Raw OCR Output',
      desc: 'The original image bitstream and the raw, unedited OCR text are treated as permanent historical records. They are isolated in read-only data structures and can never be modified.',
      icon: Lock,
      badge: 'Data Integrity',
    },
    {
      num: 2,
      title: 'Never Overwrite Raw OCR Text with AI Corrections',
      desc: 'Edited and verified texts are stored in independent variables and separate output streams. Raw OCR output is never silently overwritten.',
      icon: FileText,
      badge: 'Immutability',
    },
    {
      num: 3,
      title: 'Generate Candidate Corrections Only from Plausible Bases',
      desc: 'Suggestions are restricted to documented historical Tamil printing failure modes: dropped virama (்), ligature confusion between "ா" and "ர", loop erosion (ண vs ன), or minor grapheme edits.',
      icon: Layers,
      badge: 'Orthographic Basis',
    },
    {
      num: 4,
      title: 'Require Corroborating Evidence Before Labelling Verified',
      desc: 'No correction can achieve "verified" status without explicit evidence (visual stroke trace, classical lexicon match, or metric foot scan).',
      icon: ShieldCheck,
      badge: 'Verification Mandate',
    },
    {
      num: 5,
      title: 'Explicitly Separate Visual, Reference, and Grammar Evidence',
      desc: 'The user interface distinctly categorizes physical ink traces, external textual concordance matches, and grammatical sandhi rules so reviewers know exactly why an edit is proposed.',
      icon: Eye,
      badge: 'Evidence Transparency',
    },
    {
      num: 6,
      title: 'Flag as Uncertain if the Image Lacks a Reliable Reading',
      desc: 'When an ink blot, paper hole, or faded stroke destroys the character, the system explicitly refuses to guess a word, regardless of how statistically predictable it is.',
      icon: AlertTriangle,
      badge: 'Anti-Hallucination Core',
    },
    {
      num: 7,
      title: 'Use [unclear] as Internal Placeholder for Damaged Characters',
      desc: 'Unresolved words are preserved as [unclear] or customizable epigraphic notations like [சிதைவு]. They are never silently erased or smoothed over in the final export.',
      icon: HelpCircle,
      badge: 'Preserve Uncertainty',
    },
    {
      num: 8,
      title: 'Never Invent Reference Citations, Readings, or Scores',
      desc: 'The platform strictly forbids fabricated manuscript readings, spurious confidence numbers, or imaginary CICT citations. Confidence metrics derive purely from actual OCR signals.',
      icon: CheckCircle2,
      badge: 'Ethical Grounding',
    },
    {
      num: 9,
      title: 'Human Reviewer Authority (Accept, Reject, Edit, Uncertainty)',
      desc: 'The human epigraphist retains supreme authority over every token. AI serves solely as an assistant providing evidence, never as an unreviewed decision-maker.',
      icon: BookOpen,
      badge: 'Human-in-the-Loop',
    },
    {
      num: 10,
      title: 'Immutable Audit Trail of Every Epigraphic Decision',
      desc: 'Every change logs timestamp, operator, previous reading, new reading, evidence applied, and rationale in a verifiable audit log exported as CSV or JSON.',
      icon: GitCompare,
      badge: 'Full Traceability',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Anti-Hallucination Architecture &amp; Processing Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight mb-2">
            The TamilVault AI Anti-Hallucination Constitution
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Standard large multimodal models generate fluent Tamil text by predicting the most probable words.
            When applied to damaged 100-year-old books, this leads to <strong>hallucination of historical content</strong>.
            TamilVault AI solves this through strict isolation of evidence, immutable raw captures, and refusal to guess.
          </p>
        </div>
      </div>

      {/* Visual System Architecture Diagram */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          System Architecture &amp; End-to-End Pipeline
        </h3>

        {/* Pipeline Diagram */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto">
          <div className="space-y-2 text-sky-400 font-bold text-center pb-3 border-b border-slate-800">
            TAMILVAULT AI — END-TO-END VERIFICATION WORKFLOW
          </div>

          <div className="pt-4 grid grid-cols-1 md:grid-cols-6 gap-3 text-center">
            {/* Step 1 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] text-slate-400">INPUT</div>
              <div className="font-bold text-white text-xs mt-1">100-Yr Scanned Page</div>
              <div className="text-[10px] text-slate-400 mt-1">JPG / PNG / WebP</div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] text-blue-400">ENHANCE</div>
              <div className="font-bold text-white text-xs mt-1">Sauvola &amp; Otsu</div>
              <div className="text-[10px] text-slate-400 mt-1">Local Adaptive Binarization</div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-amber-500/50">
              <div className="text-[10px] text-amber-400">ISOLATION</div>
              <div className="font-bold text-white text-xs mt-1">Locked Raw OCR</div>
              <div className="text-[10px] text-slate-400 mt-1">Never Overwritten</div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-indigo-500/50">
              <div className="text-[10px] text-indigo-400">EVALUATION</div>
              <div className="font-bold text-white text-xs mt-1">Evidence Engine</div>
              <div className="text-[10px] text-slate-400 mt-1">Visual + CICT + Sandhi</div>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-rose-500/50">
              <div className="text-[10px] text-rose-400">DECISION</div>
              <div className="font-bold text-white text-xs mt-1">Human Review</div>
              <div className="text-[10px] text-slate-400 mt-1">Accept / Reject / [unclear]</div>
            </div>

            {/* Step 6 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-emerald-500/50">
              <div className="text-[10px] text-emerald-400">EXPORT</div>
              <div className="font-bold text-white text-xs mt-1">Archival Package</div>
              <div className="text-[10px] text-slate-400 mt-1">TXT + CSV + JSON CER</div>
            </div>
          </div>
        </div>
      </div>

      {/* The 10 Anti-Hallucination Rules Cards */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          The 10 Anti-Hallucination Rules (Detailed Specification)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.num}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                      {rule.num}
                    </span>
                    <span className="font-semibold text-xs text-slate-900">
                      {rule.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {rule.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  {rule.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
