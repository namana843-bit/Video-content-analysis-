import { Video, Sparkles, Activity, ShieldCheck, RefreshCw } from "lucide-react";

interface HeaderProps {
  onNewAnalysis?: () => void;
  hasActiveAnalysis?: boolean;
}

export function Header({ onNewAnalysis, hasActiveAnalysis }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-xs">
            V
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-800 uppercase">
              Visionary AI
            </span>
            <span className="hidden sm:inline-block text-slate-300 font-light">|</span>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Video Intelligence
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Gemini 3.1 Pro
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="hidden md:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="font-medium text-slate-700">Multimodal Video Analysis</span>
          </div>

          {hasActiveAnalysis && (
            <button
              onClick={onNewAnalysis}
              className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xs hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>
          )}

          {!hasActiveAnalysis && (
            <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Engine Ready</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
