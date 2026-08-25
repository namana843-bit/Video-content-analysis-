import { useState } from "react";
import { Zap, Copy, Check, Sparkles, MessageSquareQuote } from "lucide-react";
import { HookAnalysis } from "../types";

interface HookBreakdownProps {
  hookData: HookAnalysis;
}

export function HookBreakdown({ hookData }: HookBreakdownProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyHook = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-2xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>First 3-5 Seconds Hook Deep-Dive</span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100/80 text-amber-800 border border-amber-200">
                {hookData.hookRating || "Crucial Retention Zone"}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              80% of viewer drop-off occurs before second 5. Here is how your opening landed.
            </p>
          </div>
        </div>
      </div>

      {/* Hook Feedback */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5">
          <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gemini 3.1 Pro Hook Assessment</span>
        </h4>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {hookData.hookFeedback}
        </p>
      </div>

      {/* Alternative High-Retention Hooks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Suggested Alternative Viral Hooks</span>
          </h4>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Click to copy</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {hookData.suggestedAlternativeHooks?.map((altHook, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all group"
            >
              <div className="flex items-start space-x-3 pr-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-slate-800 font-medium italic">
                  "{altHook}"
                </span>
              </div>

              <button
                onClick={() => copyHook(altHook, idx)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shrink-0 flex items-center space-x-1 text-xs font-semibold"
                title="Copy hook"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

