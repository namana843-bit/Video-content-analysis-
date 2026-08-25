import { useState } from "react";
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  Zap,
  ListChecks,
  Bot,
  Hash,
  AlertCircle,
  Share2,
  Check,
} from "lucide-react";
import { Header } from "./components/Header";
import { VideoUploadZone, AnalysisOptions } from "./components/VideoUploadZone";
import { VideoPlayerWithTimeline } from "./components/VideoPlayerWithTimeline";
import { VerdictBanner } from "./components/VerdictBanner";
import { ScoreGrid } from "./components/ScoreGrid";
import { HookBreakdown } from "./components/HookBreakdown";
import { TimelineInspector } from "./components/TimelineInspector";
import { ActionableEdits } from "./components/ActionableEdits";
import { AlgorithmPackaging } from "./components/AlgorithmPackaging";
import { VideoDirectorChat } from "./components/VideoDirectorChat";
import { VideoAnalysisData, TimelineMoment } from "./types";

export default function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<VideoAnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"verdict" | "timeline" | "hook" | "edits" | "packaging" | "chat">("verdict");
  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(null);
  const [activeMomentSeconds, setActiveMomentSeconds] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [currentVideoName, setCurrentVideoName] = useState<string>("Uploaded Video Stream");

  const handleVideoSelected = async (fileBlob: Blob, url: string, options: AnalysisOptions) => {
    setVideoUrl(url);
    setCurrentVideoName(options.creatorGoals || "Uploaded Video Stream");
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisData(null);
    setProgressStep("Encoding video stream for multimodal ingestion...");

    try {
      // Convert blob to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string;
          const commaIdx = res.indexOf(",");
          resolve(commaIdx !== -1 ? res.substring(commaIdx + 1) : res);
        };
        reader.onerror = reject;
        reader.readAsDataURL(fileBlob);
      });

      setProgressStep("Sending to Gemini 3.1 Pro Preview for video understanding...");

      const platform = typeof options?.platform === "string" ? options.platform : "general";
      const creatorGoals = typeof options?.creatorGoals === "string" ? options.creatorGoals : "";
      const customPrompt = typeof options?.customPrompt === "string" ? options.customPrompt : "";

      const response = await fetch("/api/analyze-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoBase64: base64Data,
          mimeType: typeof fileBlob?.type === "string" && fileBlob.type ? fileBlob.type : "video/mp4",
          targetPlatform: platform,
          creatorGoals: creatorGoals,
          customPrompt: customPrompt,
        }),
      });

      setProgressStep("Processing retention curves, moments & verdicts...");

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || "Failed to analyze video");
      }

      setAnalysisData(result.data);
      setActiveTab("verdict");
    } catch (err: any) {
      console.error("Video Analysis Error:", err);
      setErrorMessage(
        err.message || "Could not analyze the video. Please verify your GEMINI_API_KEY and try again."
      );
    } finally {
      setIsAnalyzing(false);
      setProgressStep("");
    }
  };

  const handleSeekMoment = (seconds: number) => {
    setTargetTimestamp(seconds);
    setActiveMomentSeconds(seconds);
  };

  const handleShareReport = () => {
    if (!analysisData) return;
    const summary = `🎬 Video Quality Report (${analysisData.overallScore}/100) - ${analysisData.verdict}\n\nRating: ${analysisData.isGoodVerdict}\nSummary: ${analysisData.executiveSummary?.slice(0, 140)}...`;
    navigator.clipboard.writeText(summary);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const tabs = [
    { id: "verdict", label: "Verdict & Scores", icon: CheckCircle2 },
    { id: "timeline", label: "Timeline & Moments", icon: Clock, count: analysisData?.timelineBreakdown?.length },
    { id: "hook", label: "First 3-5s Hook", icon: Zap },
    { id: "edits", label: "Actionable Edits", icon: ListChecks, count: analysisData?.actionableEdits?.length },
    { id: "packaging", label: "Titles & Algorithm", icon: Hash },
    { id: "chat", label: "AI Director Chat", icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Header
        hasActiveAnalysis={!!(videoUrl && analysisData)}
        onNewAnalysis={() => {
          setAnalysisData(null);
          setVideoUrl(null);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Upload Zone */}
        <VideoUploadZone
          onVideoSelected={handleVideoSelected}
          isAnalyzing={isAnalyzing}
          analysisProgressStep={progressStep}
        />

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start space-x-3 text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <span className="font-bold">Analysis Notice: </span>
              {errorMessage}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Analysis Dashboard */}
        {videoUrl && analysisData && (
          <div className="space-y-6">
            {/* Top Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                  Analysis Complete &bull; Gemini 3.1 Pro Video Engine
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShareReport}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs"
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied Summary</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Report</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setAnalysisData(null);
                    setVideoUrl(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Analysis</span>
                </button>
              </div>
            </div>

            {/* Main 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Video Player & Sticky Timeline Helper */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
                <VideoPlayerWithTimeline
                  videoUrl={videoUrl}
                  videoTitle={currentVideoName}
                  timelineMoments={analysisData.timelineBreakdown}
                  targetTimestamp={targetTimestamp}
                  onMomentClicked={(m: TimelineMoment) => {
                    setActiveMomentSeconds(m.seconds);
                    setActiveTab("timeline");
                  }}
                />

                {/* Quick Moment Shortcuts */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                      Quick Timestamp Jumps
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Click to seek video</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {analysisData.timelineBreakdown?.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => handleSeekMoment(m.seconds)}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-slate-700 hover:text-indigo-700 text-[11px] font-mono font-medium transition-colors flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{m.timestamp}</span>
                        <span className="text-[10px] text-slate-500 font-sans truncate max-w-[80px]">
                          {m.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Tabbed Deep-Dive Modules */}
              <div className="lg:col-span-7 space-y-4">
                {/* Navigation Tabs */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          isActive
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                              isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Views */}
                {activeTab === "verdict" && (
                  <div className="space-y-6">
                    <VerdictBanner data={analysisData} />
                    <ScoreGrid scores={analysisData.scores} />
                  </div>
                )}

                {activeTab === "timeline" && (
                  <TimelineInspector
                    moments={analysisData.timelineBreakdown}
                    onSeek={handleSeekMoment}
                    activeMomentSeconds={activeMomentSeconds}
                  />
                )}

                {activeTab === "hook" && <HookBreakdown hookData={analysisData.hookAnalysis} />}

                {activeTab === "edits" && <ActionableEdits edits={analysisData.actionableEdits} />}

                {activeTab === "packaging" && (
                  <AlgorithmPackaging packaging={analysisData.audienceAndAlgorithm} />
                )}

                {activeTab === "chat" && <VideoDirectorChat analysisData={analysisData} />}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
