# 🎬 Visionary AI — Video Content Analyzer & Retention Optimizer

**Visionary AI** is an intelligent, multimodal video analysis application powered by **Gemini 3.1 Pro**. It allows content creators, editors, and marketers to evaluate whether their video content (Reels, TikToks, Shorts, YouTube videos, and commercials) is high-performing, engaging, and primed for viral reach.

---

## 🌟 What This Project Does

When you upload a video, record footage with your camera, or run a 1-click creator demo, the multimodal AI analyzes the video frames, audio clarity, hook strength, pacing rhythm, and retention psychology to provide:

1. **Instant Verdict & Quality Score**: A 0–100 quality score and clear verdict explaining what makes the video great and where viewers are likely to swipe away.
2. **Interactive Retention Heatmap & Video Player**: A custom video player paired with a visual retention timeline displaying peak engagement moments, drop-off risks, and key narrative beats.
3. **First 3–5 Seconds Hook Breakdown**: Specialized analysis of the opening hook with AI-generated alternative viral hooks ready to copy.
4. **Actionable Editing Checklist**: Prioritized list of specific cut points, transition adjustments, audio gain tweaks, and b-roll recommendations.
5. **Timeline & Moment-by-Moment Breakdown**: Synchronized timestamp bookmarks that let you click and immediately seek the video to that exact frame.
6. **Algorithm & Packaging Strategy**: High-CTR viral title concepts, ideal audience profiling, SEO hashtags, and search keyword recommendations.
7. **AI Video Director Chat**: An interactive chat assistant where you can ask follow-up questions, request script rewrites, or brainstorm thumbnail concepts tailored to your video.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend API**: Node.js, Express
- **AI Engine**: `@google/genai` with **Gemini 3.1 Pro** (`gemini-3.1-pro-preview`) for deep multimodal video and temporal understanding
- **Build Tool**: Vite & esbuild

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ installed
- A Google Gemini API Key (`GEMINI_API_KEY`)

### Environment Setup
Create a `.env` file or set the environment variable:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The app will run on `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Architecture

```
├── server.ts                       # Express backend proxying Gemini 3.1 Pro video analysis & chat
├── src/
│   ├── App.tsx                     # Main dashboard layout and state orchestration
│   ├── components/
│   │   ├── Header.tsx              # Top navigation with live analysis status
│   │   ├── VideoUploadZone.tsx     # File drag-and-drop, focus configuration & 1-click demos
│   │   ├── VideoPlayerWithTimeline.tsx # Custom 16:9 player with Retention Heatmap bar
│   │   ├── VerdictBanner.tsx       # Quality score card & AI Director recommendations
│   │   ├── ScoreGrid.tsx           # Multi-pillar scorecard (Visuals, Audio, Hook, Pacing)
│   │   ├── HookBreakdown.tsx       # 3-5 second hook audit & alternative viral hooks
│   │   ├── ActionableEdits.tsx     # Interactive editing checklist with priority filters
│   │   ├── TimelineInspector.tsx   # Timestamp bookmarks linked to video playback
│   │   ├── AlgorithmPackaging.tsx  # Viral title concepts, audience personas & tags
│   │   ├── VideoDirectorChat.tsx   # Context-aware conversational AI director
│   │   └── WebcamRecorder.tsx      # In-browser live camera & microphone video recording
│   ├── types.ts                    # TypeScript types for analysis metrics & chat
│   └── utils/
│       ├── sampleVideos.ts         # In-browser generator for quick sample creator videos
│       └── videoExtractor.ts       # Video frame extraction & encoding for AI ingestion
```

---

## 🔒 Security & Privacy
All video frames and audio data processed for analysis are routed securely server-side through Express to Google GenAI endpoints without exposing private API keys to client browsers.
