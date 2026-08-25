import { useState } from "react";
import { Sparkles, Hash, Users, AlertOctagon, Copy, Check } from "lucide-react";
import { AudienceAlgorithm } from "../types";

interface AlgorithmPackagingProps {
  packaging: AudienceAlgorithm;
}

export function AlgorithmPackaging({ packaging }: AlgorithmPackagingProps) {
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);
  const [copiedTags, setCopiedTags] = useState(false);

  const copyTitle = (title: string, idx: number) => {
    navigator.clipboard.writeText(title);
    setCopiedTitleIndex(idx);
    setTimeout(() => setCopiedTitleIndex(null), 2000);
  };

  const copyAllTags = () => {
    if (packaging.suggestedTags?.length) {
      navigator.clipboard.writeText(packaging.suggestedTags.join(" "));
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center shadow-2xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Algorithm, Titles & Packaging Strategy
          </h3>
          <p className="text-xs text-slate-500">
            How algorithms will index your content and recommendations to optimize CTR & SEO
          </p>
        </div>
      </div>

      {/* Suggested Titles */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
            High-CTR Viral Title Concepts
          </h4>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Click to copy</span>
        </div>

        <div className="space-y-2">
          {packaging.suggestedTitles?.map((title, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-purple-300 transition-all group"
            >
              <span className="text-xs sm:text-sm font-semibold text-slate-800 pr-2">
                {title}
              </span>
              <button
                onClick={() => copyTitle(title, idx)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shrink-0 flex items-center space-x-1"
              >
                {copiedTitleIndex === idx ? (
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

      {/* Audience & Algorithm Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ideal Audience */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="uppercase tracking-wider text-[11px]">Target Audience Profile</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {packaging.idealAudience}
          </p>
        </div>

        {/* Dropoff Risks */}
        <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/40 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-800">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span className="uppercase tracking-wider text-[11px]">Swipe-Away & Dropoff Risk Factor</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {packaging.dropoffRisks}
          </p>
        </div>
      </div>

      {/* Suggested Tags / Hashtags */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-purple-600" />
            <span>Recommended Hashtags & Search Keywords</span>
          </h4>
          <button
            onClick={copyAllTags}
            className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
          >
            {copiedTags ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Copied All</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Tags</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {packaging.suggestedTags?.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-700 font-mono"
            >
              {tag.startsWith("#") ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

