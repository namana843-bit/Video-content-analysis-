import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, Video, Camera, Sparkles, Youtube, Instagram, Loader2, ArrowRight } from "lucide-react";
import { WebcamRecorder } from "./WebcamRecorder";
import { generateDemoVideoBlob } from "../utils/sampleVideos";

interface VideoUploadZoneProps {
  onVideoSelected: (fileBlob: Blob, videoUrl: string, options: AnalysisOptions) => void;
  isAnalyzing: boolean;
  analysisProgressStep: string;
}

export interface AnalysisOptions {
  platform: string;
  creatorGoals: string;
  customPrompt: string;
}

export function VideoUploadZone({ onVideoSelected, isAnalyzing, analysisProgressStep }: VideoUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [platform, setPlatform] = useState<string>("Shorts / Reels / TikTok");
  const [creatorGoals, setCreatorGoals] = useState<string>("Retention & Viral Hook Quality");
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [generatingDemo, setGeneratingDemo] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    onVideoSelected(file, url, {
      platform,
      creatorGoals,
      customPrompt: customQuestion,
    });
  };

  const handleSampleDemo = async (type: "tech" | "cooking" | "fitness" | "vlog", name: string) => {
    try {
      setGeneratingDemo(type);
      const blob = await generateDemoVideoBlob(type);
      const url = URL.createObjectURL(blob);
      onVideoSelected(blob, url, {
        platform,
        creatorGoals: `${name} - Audience Retention & Viral Critique`,
        customPrompt: customQuestion,
      });
    } catch (err) {
      console.error("Demo generation failed:", err);
    } finally {
      setGeneratingDemo(null);
    }
  };

  const platforms = [
    { id: "Shorts / Reels / TikTok", label: "Reels / Shorts / TikTok", icon: Instagram },
    { id: "YouTube Long-form", label: "YouTube Long-form", icon: Youtube },
    { id: "LinkedIn / Twitter (X)", label: "LinkedIn / X Video", icon: Video },
    { id: "General / Commercial", label: "Commercial / Pitch", icon: Sparkles },
  ];

  const focusOptions = [
    "Retention & Viral Hook Quality",
    "Pacing, Cuts & Dead Air",
    "Audio Clarity & Vocal Delivery",
    "Visual Framing & Composition",
    "Overall Comprehensive Audit",
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Input Ingestion
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span className="text-[10px] font-semibold text-indigo-600">Multimodal Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Video Content Analysis</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload your creator video, record live footage with your camera, or run a 1-click sample demo.
          </p>
        </div>

        {/* Platform Selection */}
        <div className="flex flex-wrap items-center gap-2">
          {platforms.map((p) => {
            const Icon = p.icon;
            const isSelected = platform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Upload Drop Area */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[250px] ${
              dragOver
                ? "border-indigo-500 bg-indigo-50/50 scale-[1.005]"
                : "border-slate-300 hover:border-indigo-400 bg-slate-50/40 hover:bg-indigo-50/20"
            } ${isAnalyzing ? "pointer-events-none opacity-80" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-m4v,video/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isAnalyzing}
            />

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 animate-spin">
                    <Loader2 className="w-7 h-7" />
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Analyzing Video with Gemini 3.1 Pro...</h3>
                <p className="text-xs text-indigo-600 font-medium mt-1 animate-pulse">
                  {analysisProgressStep || "Evaluating frames, auditory hooks & retention curve..."}
                </p>
                <div className="w-48 bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-indigo-600 h-full w-2/3 animate-pulse rounded-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Drop your video file here or <span className="text-indigo-600 underline">browse files</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Supports MP4, WebM, MOV, M4V (Reels, TikToks, Shorts, YouTube edits up to 100MB)
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsWebcamOpen(true);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-rose-500" />
                    <span>Record with Camera</span>
                  </button>
                  <span className="text-xs text-slate-400">or drop a video file</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Side Configuration & Quick Demos */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                Analysis Focus Area
              </label>
              <select
                value={creatorGoals}
                onChange={(e) => setCreatorGoals(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {focusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                Custom Question for AI (Optional)
              </label>
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. Is my hook punchy? Where do viewers drop off?"
                className="w-full text-xs text-slate-800 bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Quick Demo Previews */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Try Demo Creators</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">1-Click Test</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isAnalyzing || !!generatingDemo}
                onClick={() => handleSampleDemo("tech", "Tech Review Reel")}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors group shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>📱 Tech Reel</span>
                  {generatingDemo === "tech" ? (
                    <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                  ) : (
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">High-retention gadget hook</p>
              </button>

              <button
                disabled={isAnalyzing || !!generatingDemo}
                onClick={() => handleSampleDemo("cooking", "Cooking Short")}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 transition-colors group shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>🍝 Food Short</span>
                  {generatingDemo === "cooking" ? (
                    <Loader2 className="w-3 h-3 animate-spin text-orange-600" />
                  ) : (
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-600 transition-colors" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">Quick recipe tutorial</p>
              </button>

              <button
                disabled={isAnalyzing || !!generatingDemo}
                onClick={() => handleSampleDemo("fitness", "Fitness Vlog Hook")}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors group shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>🏋️ Fitness Form</span>
                  {generatingDemo === "fitness" ? (
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                  ) : (
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">Form cue & workout tip</p>
              </button>

              <button
                disabled={isAnalyzing || !!generatingDemo}
                onClick={() => handleSampleDemo("vlog", "Travel Vlog Opener")}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-pink-400 hover:bg-pink-50/40 transition-colors group shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>🇯🇵 Travel Vlog</span>
                  {generatingDemo === "vlog" ? (
                    <Loader2 className="w-3 h-3 animate-spin text-pink-600" />
                  ) : (
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-pink-600 transition-colors" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">Storytelling budget reel</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <WebcamRecorder
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onVideoRecorded={(blob, url) => {
          onVideoSelected(blob, url, {
            platform,
            creatorGoals,
            customPrompt: customQuestion,
          });
        }}
      />
    </div>
  );
}

