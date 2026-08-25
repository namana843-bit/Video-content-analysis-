import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, FastForward, Repeat, TrendingDown, Sparkles, AlertCircle } from "lucide-react";
import { TimelineMoment } from "../types";

interface VideoPlayerProps {
  videoUrl: string;
  timelineMoments?: TimelineMoment[];
  targetTimestamp?: number | null;
  onMomentClicked?: (moment: TimelineMoment) => void;
  videoTitle?: string;
}

export function VideoPlayerWithTimeline({
  videoUrl,
  timelineMoments = [],
  targetTimestamp = null,
  onMomentClicked,
  videoTitle = "Uploaded Video Stream",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  // Jump to timestamp when targetTimestamp changes
  useEffect(() => {
    if (targetTimestamp !== null && targetTimestamp !== undefined && videoRef.current) {
      videoRef.current.currentTime = targetTimestamp;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [targetTimestamp]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const seekToSeconds = (seconds: number) => {
    setCurrentTime(seconds);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Simulated dynamic retention heatmap based on timeline dropoff warnings
  const warningMoments = timelineMoments.filter((m) => m.type === "warning");
  const primaryDropoff = warningMoments.length > 0 ? warningMoments[0] : null;
  const dropoffPercent = primaryDropoff && duration > 0 ? Math.min(Math.max((primaryDropoff.seconds / duration) * 100, 5), 90) : 25;

  return (
    <div className="space-y-4">
      {/* Video Viewport with Professional Polish white border & deep shadow */}
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl group border-4 border-white">
        <div
          ref={containerRef}
          onClick={togglePlay}
          className="relative bg-slate-950 flex items-center justify-center min-h-[280px] max-h-[440px] cursor-pointer"
        >
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            loop={isLooping}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="max-h-[440px] w-auto max-w-full object-contain mx-auto"
          />

          {/* Play/Pause Overlay Animation */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-2xs transition-all">
              <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-current ml-1 text-slate-900" />
              </div>
            </div>
          )}

          {/* Bottom Title Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-linear-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
            <h3 className="text-white font-bold text-base sm:text-lg drop-shadow-xs truncate">
              {videoTitle}
            </h3>
            <p className="text-slate-300 text-xs flex items-center space-x-2 mt-0.5">
              <span>Duration: {formatTime(duration)}</span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-medium">Synced with Gemini AI Timeline</span>
            </p>
          </div>

          {/* Top Floating Time Pill */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border border-white/10 shadow-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Scrubber with Markers */}
        <div className="px-4 pt-2.5 pb-1 bg-slate-900">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
            />

            {/* Timeline moment markers on scrubber */}
            {duration > 0 &&
              timelineMoments.map((m, idx) => {
                const posPercent = Math.min(Math.max((m.seconds / duration) * 100, 0), 100);
                const colorClass =
                  m.type === "highlight"
                    ? "bg-emerald-400"
                    : m.type === "warning"
                    ? "bg-rose-400"
                    : m.type === "opportunity"
                    ? "bg-amber-400"
                    : "bg-indigo-400";

                return (
                  <button
                    key={idx}
                    title={`${m.timestamp} - ${m.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      seekToSeconds(m.seconds);
                      onMomentClicked?.(m);
                    }}
                    style={{ left: `${posPercent}%` }}
                    className={`absolute -top-1 w-3 h-3.5 rounded-xs transform -translate-x-1/2 ${colorClass} hover:scale-150 transition-transform shadow-xs z-10`}
                  />
                );
              })}
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="px-4 py-2 bg-slate-950 flex items-center justify-between text-slate-300 text-xs border-t border-slate-800/60">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime = 0;
              }}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="text-slate-400 font-mono text-[11px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1.5 rounded-lg transition-colors text-xs flex items-center space-x-1 ${
                isLooping ? "bg-indigo-600/30 text-indigo-400" : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}
              title="Toggle Loop"
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={changeSpeed}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center space-x-1 transition-colors"
            >
              <FastForward className="w-3 h-3" />
              <span>{playbackRate}x</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Retention Heatmap Card from Professional Polish Theme */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-indigo-600" />
            <span>Retention Heatmap & Drop-off Curve</span>
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            AI Modeled
          </span>
        </div>

        {/* Visual Bar Graph with drop-off indicators */}
        <div className="w-full h-20 bg-slate-100 rounded-xl relative flex items-end overflow-hidden p-1.5 gap-1">
          <div className="flex-1 bg-indigo-500 h-[95%] opacity-90 rounded-xs transition-all hover:opacity-100" title="0:00 - 95% retention"></div>
          <div className="flex-1 bg-indigo-500 h-[90%] opacity-85 rounded-xs transition-all hover:opacity-100" title="0:03 - 90% retention"></div>
          <div className="flex-1 bg-indigo-500 h-[88%] opacity-80 rounded-xs transition-all hover:opacity-100" title="Hook payoff"></div>
          <div className="flex-1 bg-indigo-500 h-[72%] opacity-65 rounded-xs transition-all hover:opacity-100" title="Transition segment"></div>
          <div className="flex-1 bg-indigo-500 h-[58%] opacity-50 rounded-xs transition-all hover:opacity-100" title="Middle body"></div>
          <div className="flex-1 bg-indigo-500 h-[68%] opacity-60 rounded-xs transition-all hover:opacity-100" title="Climax segment"></div>
          <div className="flex-1 bg-indigo-500 h-[64%] opacity-55 rounded-xs transition-all hover:opacity-100" title="Outro call to action"></div>
          <div className="flex-1 bg-indigo-600 h-[48%] opacity-45 rounded-xs transition-all hover:opacity-100" title="Final seconds"></div>

          {/* Significant Dropoff Indicator Line */}
          <div
            style={{ left: `${dropoffPercent}%` }}
            className="absolute bottom-0 h-full w-[2px] bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] pointer-events-none"
          />

          {/* Indicator Tooltip Badge */}
          <div
            style={{ left: `${dropoffPercent}%` }}
            onClick={() => primaryDropoff && seekToSeconds(primaryDropoff.seconds)}
            className="absolute top-2 -translate-x-1/2 ml-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 cursor-pointer hover:bg-rose-600 transition-colors"
          >
            <AlertCircle className="w-2.5 h-2.5" />
            <span>{primaryDropoff ? `Drop-off: ${primaryDropoff.timestamp}` : "Retention Dip Zone"}</span>
          </div>
        </div>

        {/* Timestamp Axis */}
        <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono px-1">
          <span>0:00</span>
          <span>{formatTime(duration * 0.25)}</span>
          <span>{formatTime(duration * 0.5)}</span>
          <span>{formatTime(duration * 0.75)}</span>
          <span>{formatTime(duration || 60)}</span>
        </div>
      </div>
    </div>
  );
}

