import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sliders,
  RotateCcw,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  Columns,
  ZoomIn,
  ZoomOut,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { DigitisationSession, EnhancementSettings } from '../types';
import { SAMPLE_MANUSCRIPTS } from '../data/sampleManuscripts';

interface UploadEnhanceViewProps {
  session: DigitisationSession;
  onUpdateSession: (updated: DigitisationSession) => void;
  onSelectSampleManuscript: (sampleId: string) => void;
  onProceedToOcr: () => void;
  onExecuteOcr: (settings?: EnhancementSettings) => Promise<void>;
  isOcrRunning: boolean;
  ocrProgressStep: string;
}

export const UploadEnhanceView: React.FC<UploadEnhanceViewProps> = ({
  session,
  onUpdateSession,
  onSelectSampleManuscript,
  onProceedToOcr,
  onExecuteOcr,
  isOcrRunning,
  ocrProgressStep,
}) => {
  const [settings, setSettings] = useState<EnhancementSettings>(session.enhancementSettings);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'enhanced-only' | 'original-only'>('side-by-side');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  // Sync settings when session changes
  useEffect(() => {
    setSettings(session.enhancementSettings);
  }, [session.id]);

  // Handle local file upload (JPG, JPEG, PNG, WEBP, and PDF)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setUploadSuccess(null);

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 30MB)
    if (file.size > 30 * 1024 * 1024) {
      setUploadError('File size exceeds 30MB limit. Please upload a smaller scan or single-page PDF.');
      return;
    }

    // Validate type: JPG, JPEG, PNG, WEBP, or PDF
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    const fileName = file.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => fileName.endsWith(ext));
    const isValidMime =
      file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.includes('pdf');

    if (!isValidExt && !isValidMime) {
      setUploadError('Unsupported file format. Please upload a Tamil book scan in JPG, JPEG, PNG, WebP, or PDF format.');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (loadEvt) => {
        try {
          const fileData = loadEvt.target?.result as string;

          // Call backend to store actual file and create fresh real session
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: file.name.replace(/\.[^/.]+$/, ''),
              fileName: file.name,
              fileType: file.type || (fileName.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
              fileData,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Server failed to process uploaded file.');
          }

          const data = await res.json();
          if (data.session) {
            onUpdateSession(data.session);
            setUploadSuccess(
              `Successfully uploaded "${file.name}" (${data.session.fileType === 'pdf' ? `${data.session.totalPages} pages` : 'image'}). Ready for real Tamil OCR.`
            );
          }
        } catch (postErr: any) {
          setUploadError(postErr.message || 'Error uploading file.');
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setUploadError('Failed to read the selected file.');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || 'Error reading file.');
      setIsUploading(false);
    }
  };

  // Change PDF Page
  const handlePdfPageChange = async (newPage: number) => {
    if (!session.totalPages || newPage < 1 || newPage > session.totalPages) return;

    try {
      const res = await fetch('/api/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          pageNum: newPage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          onUpdateSession(data.session);
        }
      }
    } catch (err) {
      console.error('Failed to change page:', err);
    }
  };

  const resetFilters = () => {
    const defaultSettings: EnhancementSettings = {
      brightness: 0,
      contrast: 15,
      grayscale: true,
      denoising: true,
      thresholdMode: 'sauvola',
      thresholdValue: 128,
      invert: false,
    };
    setSettings(defaultSettings);
    onUpdateSession({
      ...session,
      enhancementSettings: defaultSettings,
    });
  };

  const applySauvolaPreset = () => {
    const s: EnhancementSettings = {
      brightness: 10,
      contrast: 25,
      grayscale: true,
      denoising: true,
      thresholdMode: 'sauvola',
      thresholdValue: 128,
      invert: false,
    };
    setSettings(s);
    onUpdateSession({
      ...session,
      enhancementSettings: s,
    });
  };

  const applyOtsuPreset = () => {
    const s: EnhancementSettings = {
      brightness: 5,
      contrast: 20,
      grayscale: true,
      denoising: true,
      thresholdMode: 'otsu',
      thresholdValue: 130,
      invert: false,
    };
    setSettings(s);
    onUpdateSession({
      ...session,
      enhancementSettings: s,
    });
  };

  const handleRunOcrClick = async () => {
    await onExecuteOcr(settings);
    onProceedToOcr();
  };

  return (
    <div className="space-y-6">
      {/* Upload & Ingest Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              Upload &amp; Image Enhancement Engine
            </h2>
            <p className="text-xs text-slate-500">
              Upload your own 100-year-old Tamil book scan (JPG, PNG, WebP, or PDF) for dynamic OCR text extraction.
            </p>
          </div>

          {/* Toggle for Historical Benchmark Demo Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDemoSelector(!showDemoSelector)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              {showDemoSelector ? 'Hide Benchmark Demos' : 'Explore Benchmark Demo Datasets'}
            </button>
          </div>
        </div>

        {/* Separated Benchmark Demo Mode Selector */}
        {showDemoSelector && (
          <div className="mt-4 p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                Historical Benchmark Datasets (Clearly Labelled Demo Mode)
              </span>
              <span className="text-[11px] text-amber-700">Pre-computed scholarly ground truths</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Select one of these pre-evaluated historical samples if you want to inspect known 19th/20th-century lead-type degradation benchmarks:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {SAMPLE_MANUSCRIPTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSampleManuscript(s.id);
                    setShowDemoSelector(false);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                    session.id === s.id
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-white hover:bg-amber-100/60 text-slate-800 border-amber-200'
                  }`}
                >
                  {s.title.split('—')[0].trim()} ({s.sourceMetadata.publicationYear})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Real File Upload Dropzone */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-colors block">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf,.pdf"
                onChange={handleFileUpload}
                disabled={isUploading || isOcrRunning}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  Click or drag to upload a Tamil book page (JPG, PNG, WebP, PDF)
                </span>
                <span className="text-xs text-slate-500">
                  Real image-based OCR: The system extracts Tamil text directly from your uploaded file (Max 30MB)
                </span>
              </div>
            </label>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Don't have a Tamil book scan handy?</span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setIsUploading(true);
                    const res = await fetch('/api/generate-test-scan', { method: 'POST' });
                    const data = await res.json();
                    if (data.session) {
                      onUpdateSession(data.session);
                      setUploadSuccess('Generated fresh real Tamil scan page on server. Click "Extract Tamil Text" to run OCR.');
                    }
                  } catch (e: any) {
                    setUploadError('Failed to generate test scan: ' + e.message);
                  } finally {
                    setIsUploading(false);
                  }
                }}
                disabled={isUploading || isOcrRunning}
                className="text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate Instant Tamil Test Scan
              </button>
            </div>
          </div>

          {/* Active File Metadata Badge */}
          <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block mb-1">Active File in Processing:</span>
            <div className="font-medium text-slate-900 truncate">{session.title}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <span className="font-mono">
                {session.fileType === 'pdf' ? `PDF (${session.totalPages || 1} pages)` : 'Image file'}
              </span>
              <span>•</span>
              <span className={session.isDemoSample ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                {session.isDemoSample ? 'Demo Dataset' : 'Real Uploaded Scan'}
              </span>
            </div>
            {session.rawOcrText ? (
              <div className="text-[11px] text-emerald-600 font-semibold pt-1">
                OCR Status: Extracted ({session.tokens.length} words)
              </div>
            ) : (
              <div className="text-[11px] text-amber-600 font-semibold pt-1">
                OCR Status: Awaiting OCR Execution
              </div>
            )}
          </div>
        </div>

        {uploadError && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
        {uploadSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2 border border-emerald-200">
            <Check className="w-4 h-4 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Multi-page PDF Navigation controls if PDF has > 1 page */}
        {session.fileType === 'pdf' && (session.totalPages || 1) > 1 && (
          <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-blue-900">
              <FileText className="w-4 h-4 text-blue-700" />
              Multi-page PDF Document Navigation
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePdfPageChange((session.currentPage || 1) - 1)}
                disabled={(session.currentPage || 1) <= 1}
                className="p-1.5 bg-white border border-blue-200 hover:bg-blue-100 disabled:opacity-40 rounded text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-slate-800">
                Page {session.currentPage || 1} of {session.totalPages}
              </span>
              <button
                onClick={() => handlePdfPageChange((session.currentPage || 1) + 1)}
                disabled={(session.currentPage || 1) >= (session.totalPages || 1)}
                className="p-1.5 bg-white border border-blue-200 hover:bg-blue-100 disabled:opacity-40 rounded text-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Enhancement Workspace: Controls on Left, Live Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Filter Sliders & OCR Action */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                Image Enhancements
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Archival Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Archival Presets:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={applySauvolaPreset}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium py-1.5 px-2 rounded border border-blue-200 transition-colors text-left"
                >
                  <span className="font-bold block">Sauvola Local</span>
                  <span className="text-[10px] text-blue-600/80">Best for faded ink</span>
                </button>
                <button
                  onClick={applyOtsuPreset}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium py-1.5 px-2 rounded border border-slate-200 transition-colors text-left"
                >
                  <span className="font-bold block">Otsu Global</span>
                  <span className="text-[10px] text-slate-500">Uniform binarization</span>
                </button>
              </div>
            </div>

            {/* Brightness Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Brightness</span>
                <span className="font-mono text-slate-500">{settings.brightness}</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={settings.brightness}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSettings({ ...settings, brightness: val });
                  onUpdateSession({ ...session, enhancementSettings: { ...settings, brightness: val } });
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Contrast Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Contrast</span>
                <span className="font-mono text-slate-500">+{settings.contrast}%</span>
              </div>
              <input
                type="range"
                min="-40"
                max="60"
                value={settings.contrast}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSettings({ ...settings, contrast: val });
                  onUpdateSession({ ...session, enhancementSettings: { ...settings, contrast: val } });
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Threshold Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Binarization Algorithm:
              </label>
              <select
                value={settings.thresholdMode}
                onChange={(e) => {
                  const mode = e.target.value as any;
                  setSettings({ ...settings, thresholdMode: mode });
                  onUpdateSession({ ...session, enhancementSettings: { ...settings, thresholdMode: mode } });
                }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None (Continuous Tone)</option>
                <option value="sauvola">Sauvola Adaptive (Recommended for Faded Manuscripts)</option>
                <option value="otsu">Otsu Global Threshold</option>
                <option value="adaptive">Local Mean Threshold</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.grayscale}
                  onChange={(e) => {
                    const g = e.target.checked;
                    setSettings({ ...settings, grayscale: g });
                    onUpdateSession({ ...session, enhancementSettings: { ...settings, grayscale: g } });
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">Grayscale Conversion (Rec. 601)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.denoising}
                  onChange={(e) => {
                    const d = e.target.checked;
                    setSettings({ ...settings, denoising: d });
                    onUpdateSession({ ...session, enhancementSettings: { ...settings, denoising: d } });
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">OpenCV Bilateral Denoising</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.invert}
                  onChange={(e) => {
                    const inv = e.target.checked;
                    setSettings({ ...settings, invert: inv });
                    onUpdateSession({ ...session, enhancementSettings: { ...settings, invert: inv } });
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">Invert Binarization</span>
              </label>
            </div>

            {/* Run Real OCR CTA Button */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={handleRunOcrClick}
                disabled={isOcrRunning}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs py-3 px-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isOcrRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Extracting Tamil Text...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>Extract Tamil Text (Real OCR) &rarr;</span>
                  </>
                )}
              </button>

              {isOcrRunning && (
                <div className="p-2.5 bg-blue-50 rounded-lg text-[11px] text-blue-800 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                    Processing Stage:
                  </div>
                  <div className="text-slate-600">{ocrProgressStep}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (3 Cols): Live Visual Image Display */}
        <div className="lg:col-span-3 space-y-3">
          {/* Canvas View Controls Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'side-by-side' ? 'bg-white shadow-2xs text-blue-700 font-semibold' : 'text-slate-600'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                Side-by-Side
              </button>
              <button
                onClick={() => setViewMode('original-only')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'original-only' ? 'bg-white shadow-2xs text-blue-700 font-semibold' : 'text-slate-600'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Uploaded Scan
              </button>
              <button
                onClick={() => setViewMode('enhanced-only')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'enhanced-only' ? 'bg-white shadow-2xs text-blue-700 font-semibold' : 'text-slate-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Enhanced Preview
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Zoom:</span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.2))}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono font-medium text-slate-700 w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scanned Image Display Canvas Area */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-300 p-4 min-h-[550px] overflow-auto flex items-center justify-center">
            <div
              className={`grid gap-4 transition-transform duration-200 origin-center ${
                viewMode === 'side-by-side' ? 'grid-cols-1 md:grid-cols-2 max-w-5xl' : 'grid-cols-1 max-w-2xl'
              }`}
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Uploaded Scan Pane */}
              {(viewMode === 'side-by-side' || viewMode === 'original-only') && (
                <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-md">
                  <div className="bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-300 flex items-center justify-between border-b border-slate-700">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      Uploaded Scan: {session.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {session.fileType === 'pdf' ? `PDF Page ${session.currentPage || 1}` : 'Raw File'}
                    </span>
                  </div>
                  <div className="p-2 flex items-center justify-center bg-slate-950">
                    <img
                      src={session.originalImageUrl}
                      alt="Uploaded Tamil Scan"
                      className="max-h-[600px] w-auto object-contain rounded shadow-xs"
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Pane */}
              {(viewMode === 'side-by-side' || viewMode === 'enhanced-only') && (
                <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-md">
                  <div className="bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-300 flex items-center justify-between border-b border-slate-700">
                    <span className="flex items-center gap-1.5 text-blue-300">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      OpenCV Preprocessed Image
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {settings.thresholdMode.toUpperCase()} Filtered
                    </span>
                  </div>
                  <div className="p-2 flex items-center justify-center bg-slate-950">
                    {session.enhancedImageUrl ? (
                      <img
                        src={session.enhancedImageUrl}
                        alt="OpenCV Enhanced Scan"
                        className="max-h-[600px] w-auto object-contain rounded shadow-xs"
                      />
                    ) : (
                      <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 text-xs space-y-2 p-6 text-center">
                        <Sparkles className="w-8 h-8 text-blue-400 opacity-60" />
                        <p>Click "Extract Tamil Text (Real OCR)" to generate the OpenCV preprocessed image and run Tesseract OCR on this file.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
