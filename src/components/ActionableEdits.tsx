import { useState } from "react";
import { CheckSquare, Square, ListChecks, ArrowUpRight, Flame, ShieldAlert, Sparkles } from "lucide-react";
import { ActionableEdit } from "../types";

interface ActionableEditsProps {
  edits: ActionableEdit[];
}

export function ActionableEdits({ edits }: ActionableEditsProps) {
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (idx: number) => {
    setCompletedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return {
          icon: Flame,
          label: "High Priority",
          color: "text-rose-700 bg-rose-50 border-rose-200",
        };
      case "medium":
        return {
          icon: Sparkles,
          label: "Medium Priority",
          color: "text-amber-700 bg-amber-50 border-amber-200",
        };
      default:
        return {
          icon: ShieldAlert,
          label: "Low Priority Polish",
          color: "text-slate-700 bg-slate-50 border-slate-200",
        };
    }
  };

  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const totalCount = edits?.length || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Actionable Editing Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Specific, concrete cuts and tweaks recommended by Gemini 3.1 Pro to boost performance
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200 shadow-2xs">
          {completedCount} of {totalCount} completed
        </div>
      </div>

      <div className="space-y-3">
        {edits?.map((edit, idx) => {
          const isDone = !!completedItems[idx];
          const badge = getPriorityBadge(edit.priority);
          const Icon = badge.icon;

          return (
            <div
              key={idx}
              onClick={() => toggleItem(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                isDone
                  ? "bg-slate-50/80 border-slate-200 opacity-60 line-through"
                  : "bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-xs"
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
              >
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${badge.color}`}>
                    <Icon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                  <h4 className={`text-xs sm:text-sm font-bold ${isDone ? "text-slate-500" : "text-slate-900"}`}>
                    {edit.task}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  <span className="font-semibold text-slate-700">Rationale: </span>
                  {edit.rationale}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

