import { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, TrendingUp, Download, Check, Copy } from "lucide-react";
import { VideoAnalysisData } from "../types";

interface VerdictBannerProps {
  data: VideoAnalysisData;
}

export function VerdictBanner({ data }: VerdictBannerProps) {
  const [copiedReport, setCopiedReport] = useState(false);
  const score = data.overallScore || 0;

  const isGood = score >= 75 || data.isGoodVerdict?.toLowerCase().includes("good");
  const isNeedsWork = score < 50 || data.isGoodVerdict?.toLowerCase().includes("rework");

  const verdictColor = isGood
    ? "text-emerald-600 font-bold"
    : isNeedsWork
    ? "text-rose-600 font-bold"
    : "text-amber-600 font-bold";

  const handleExportOrCopy = () => {
    const reportText = `🎬 Visionary AI - Video Quality Analysis Report
Score: ${score}/100
Verdict: ${data.isGoodVerdict || data.verdict}

Executive Summary:
${data.executiveSummary}

Key Strengths:
${data.strengths?.map((s) => `• ${s}`).join("\n")}

Drop-off Risks & Weaknesses:
${data.weaknesses?.map((w) => `• ${w}`).join("\n")}

Top Actionable Recommendations:
${data.actionableEdits?.slice(0, 3).map((e, idx) => `${idx + 1}. [${e.priority}] ${e.task} - ${e.rationale}`).join("\n")}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Analysis Result Card (Professional Polish Style) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                AI Video Evaluation
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span className="text-[10px] font-semibold text-indigo-600">Gemini 3.1 Pro</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Analysis Result</h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Verdict: <span className={verdictColor}>{data.isGoodVerdict || (isGood ? "Solid Potential" : "Needs Optimization")}</span>
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
            <div className="text-4xl font-black text-indigo-600 leading-none">
              {score}
              <span className="text-lg font-bold text-slate-300">/100</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Quality Score
            </span>
          </div>
        </div>

        {/* 4-Quadrant Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Visual Polish</p>
            <p className="text-base font-bold text-slate-800">
              {data.scores.visuals >= 80 ? "High (A-)" : data.scores.visuals >= 65 ? "Moderate (B)" : "Needs Work (C)"}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Audio Quality</p>
            <p className="text-base font-bold text-slate-800">
              {data.scores.audio >= 80 ? "Crisp (A)" : data.scores.audio >= 65 ? "Moderate (B)" : "Needs Gain (C)"}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hook Strength</p>
            <p className={`text-base font-bold ${data.scores.hook >= 75 ? "text-emerald-600" : "text-amber-600"}`}>
              {data.scores.hook >= 80 ? "Excellent (A+)" : data.scores.hook >= 65 ? "Promising (B)" : "Slow Intro (C-)"}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pacing & Flow</p>
            <p className={`text-base font-bold ${data.scores.pacing >= 75 ? "text-slate-800" : "text-amber-600"}`}>
              {data.scores.pacing >= 80 ? "Snappy (A)" : data.scores.pacing >= 65 ? "Moderate (B)" : "Lagging (C+)"}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Executive Summary
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            {data.executiveSummary}
          </p>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What Makes This Good (Strengths)</span>
            </h5>
            <ul className="space-y-1.5">
              {data.strengths?.map((str, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-4 space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Retention Risks & Weaknesses</span>
            </h5>
            <ul className="space-y-1.5">
              {data.weaknesses?.map((weak, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Deep Indigo AI Recommendations Card (Professional Polish Signature) */}
      <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-200">
              AI Director Recommendations
            </h3>
          </div>
          <span className="text-[10px] text-indigo-300 font-mono">Gemini 3.1 Pro Engine</span>
        </div>

        <div className="flex flex-col gap-3">
          {data.actionableEdits && data.actionableEdits.length > 0 ? (
            data.actionableEdits.slice(0, 3).map((edit, idx) => (
              <div key={idx} className="flex gap-3.5 items-start bg-white/10 p-3.5 rounded-xl border border-white/5 backdrop-blur-xs">
                <div className="w-6 h-6 shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {idx + 1}
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {edit.task}
                  </p>
                  <p className="text-xs text-indigo-100/90 leading-relaxed font-normal">
                    {edit.rationale}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/10 p-3.5 rounded-xl text-xs text-indigo-100">
              Review timeline moments and hook tabs for targeted pacing tweaks.
            </div>
          )}
        </div>

        <button
          onClick={handleExportOrCopy}
          className="mt-2 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2"
        >
          {copiedReport ? (
            <>
              <Check className="w-4 h-4 text-slate-900" />
              <span>Full Analysis Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-900" />
              <span>Export Full Analysis Report (Summary)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

