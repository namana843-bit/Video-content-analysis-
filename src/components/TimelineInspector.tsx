import { Clock, Play, AlertTriangle, Sparkles, CheckCircle2, Info } from "lucide-react";
import { TimelineMoment } from "../types";

interface TimelineInspectorProps {
  moments: TimelineMoment[];
  onSeek: (seconds: number) => void;
  activeMomentSeconds?: number | null;
}

export function TimelineInspector({ moments, onSeek, activeMomentSeconds }: TimelineInspectorProps) {
  const getTypeBadge = (type: TimelineMoment["type"]) => {
    switch (type) {
      case "highlight":
        return {
          icon: CheckCircle2,
          label: "Strong Highlight",
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          label: "Drop-off Risk",
          color: "text-rose-700 bg-rose-50 border-rose-200",
        };
      case "opportunity":
        return {
          icon: Sparkles,
          label: "Edit Opportunity",
          color: "text-amber-700 bg-amber-50 border-amber-200",
        };
      default:
        return {
          icon: Info,
          label: "Key Beat",
          color: "text-indigo-700 bg-indigo-50 border-indigo-200",
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Timeline & Moment-by-Moment Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500">
            Click any timestamp to immediately jump the video player to that exact moment.
          </p>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          {moments?.length || 0} Key Markers Detected
        </span>
      </div>

      <div className="space-y-3">
        {moments?.map((moment, idx) => {
          const badge = getTypeBadge(moment.type);
          const Icon = badge.icon;
          const isActive =
            activeMomentSeconds !== null &&
            activeMomentSeconds !== undefined &&
            Math.abs(activeMomentSeconds - moment.seconds) < 2;

          return (
            <div
              key={idx}
              onClick={() => onSeek(moment.seconds)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isActive
                  ? "border-indigo-500 bg-indigo-50/60 shadow-xs"
                  : "border-slate-200/90 bg-white hover:border-indigo-300 hover:bg-slate-50/70"
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  type="button"
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-indigo-600 transition-colors text-xs font-mono font-bold shrink-0 shadow-2xs group"
                >
                  <Play className="w-3 h-3 fill-current group-hover:scale-110 transition-transform" />
                  <span>{moment.timestamp}</span>
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{moment.title}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${badge.color}`}>
                      <Icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{moment.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

