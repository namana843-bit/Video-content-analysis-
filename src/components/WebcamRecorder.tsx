import { useState, useRef, useEffect } from "react";
import { Camera, Square, Play, RefreshCw, X, AlertCircle } from "lucide-react";

interface WebcamRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoRecorded: (blob: Blob, url: string) => void;
}

export function WebcamRecorder({ isOpen, onClose, onVideoRecorded }: WebcamRecorderProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playbackRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      resetRecording();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setErrorMsg("Unable to access camera and microphone. Please allow camera permissions in your browser.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingSeconds(0);

    const options = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? { mimeType: "video/webm;codecs=vp9,opus" }
      : { mimeType: "video/webm" };

    try {
      const recorder = new MediaRecorder(stream, options);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setRecordedUrl(url);
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (e: any) {
      setErrorMsg("Failed to start media recording: " + e.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
    }
    setRecordingSeconds(0);
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleUseVideo = () => {
    if (recordedBlob && recordedUrl) {
      onVideoRecorded(recordedBlob, recordedUrl);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Webcam Video Recorder</h3>
              <p className="text-xs text-slate-500">Record a short clip, hook, or pitch for instant analysis</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-950 flex-1 relative flex items-center justify-center min-h-[340px]">
          {errorMsg ? (
            <div className="p-6 text-center text-rose-400 max-w-sm">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium">{errorMsg}</p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors"
              >
                Retry Camera
              </button>
            </div>
          ) : recordedUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <video
                ref={playbackRef}
                src={recordedUrl}
                controls
                autoPlay
                className="max-h-[360px] rounded-lg shadow-lg border border-slate-800"
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-h-[360px] rounded-lg w-full object-cover transform -scale-x-100"
              />
              {isRecording && (
                <div className="absolute top-4 left-4 bg-rose-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>REC {formatSeconds(recordingSeconds)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {isRecording ? (
              <span className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                Recording in progress...
              </span>
            ) : recordedUrl ? (
              <span className="text-xs text-emerald-600 font-medium">Recording captured ({formatSeconds(recordingSeconds)})</span>
            ) : (
              <span className="text-xs text-slate-500">Max recommended duration: 30-90 seconds</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {recordedUrl ? (
              <>
                <button
                  onClick={() => {
                    resetRecording();
                    startCamera();
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center space-x-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-record</span>
                </button>
                <button
                  onClick={handleUseVideo}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Use This Recording</span>
                </button>
              </>
            ) : isRecording ? (
              <button
                onClick={stopRecording}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Recording ({formatSeconds(recordingSeconds)})</span>
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={!stream}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-xs transition-colors"
              >
                <div className="w-3 h-3 rounded-full bg-white" />
                <span>Start Recording</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
