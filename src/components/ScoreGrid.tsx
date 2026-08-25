import { Zap, Film, Mic, Eye, Target, Sparkles } from "lucide-react";
import { VideoAnalysisScores } from "../types";

interface ScoreGridProps {
  scores: VideoAnalysisScores;
}

export function ScoreGrid({ scores }: ScoreGridProps) {
  const cards = [
    {
      title: "Hook & First 3-5s",
      score: scores.hook || 0,
      icon: Zap,
      description: "Visual grab, verbal opening, instant intrigue",
      category: "Retention",
    },
    {
      title: "Pacing & Cut Rhythm",
      score: scores.pacing || 0,
      icon: Film,
      description: "Dynamic edits, lack of dead air, transition flow",
      category: "Editing",
    },
    {
      title: "Audio & Vocal Delivery",
      score: scores.audio || 0,
      icon: Mic,
      description: "Speech clarity, volume balancing, vocal energy",
      category: "Sound",
    },
    {
      title: "Visual Quality & Framing",
      score: scores.visuals || 0,
      icon: Eye,
      description: "Lighting, camera angle, eye contact, b-roll context",
      category: "Production",
    },
    {
      title: "Value & Core Promise",
      score: scores.valueDelivery || 0,
      icon: Target,
      description: "Payoff on hook, clarity of advice or entertainment",
      category: "Content",
    },
    {
      title: "Estimated Completion Rate",
      score: scores.retentionPotential || 0,
      icon: Sparkles,
      description: "Algorithm recommendation probability",
      category: "Algorithm",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 65) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 65) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Core Pillar Scorecard</h3>
          <p className="text-xs text-slate-500">
            Multi-dimensional evaluation computed by Gemini 3.1 Pro
          </p>
        </div>
        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
          Benchmark: 80+ is High Performing
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                    <Icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{card.title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{card.category}</span>
                  </div>
                </div>

                <div
                  className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getScoreColor(card.score)}`}
                >
                  {card.score}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(card.score)}`}
                    style={{ width: `${card.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

