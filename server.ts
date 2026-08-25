import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      model: "gemini-3.1-pro-preview",
      hasApiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // Video Analysis Endpoint using gemini-3.1-pro-preview
  app.post("/api/analyze-video", async (req, res) => {
    try {
      const { videoBase64, mimeType = "video/mp4", targetPlatform = "general", creatorGoals = "", customPrompt = "" } = req.body;

      if (!videoBase64) {
        return res.status(400).json({ error: "No video data provided" });
      }

      const ai = getAiClient();

      const systemInstruction = `You are a world-class professional Video Producer, Content Strategist, and Viral Media Analyst.
Your task is to thoroughly analyze the provided video and give honest, precise, and actionable feedback on whether the video is "good or not", along with detailed metric scores, timestamped key moments, strengths, weaknesses, and concrete recommendations to maximize retention and engagement.

Target Platform: ${targetPlatform}
Creator's Stated Goals/Context: ${creatorGoals || "Maximize viewer engagement and overall quality"}

Analyze the video across these core pillars:
1. Hook & First 3-5 Seconds: Does it instantly grab attention? Visual punch, verbal hook, clarity of promise.
2. Pacing & Editing Flow: Rhythm of cuts, dead air removal, b-roll usage, zooms, and retention spikes or drops.
3. Audio & Vocal Delivery: Voice clarity, confidence, tone, volume balancing with music/sound effects.
4. Visual Quality & Framing: Lighting, eye level, camera stability, framing, composition, visual interest.
5. Storytelling & Value: Clarity of message, entertainment/educational value, payoff.
6. Call to Action (CTA) & Retention: Smooth wrap-up, viewer retention until the end, effective CTA.

Provide timestamped breakdown with specific seconds and mm:ss format so the creator can jump to exact moments in their video.`;

      const userPromptText = customPrompt || `Perform a complete, in-depth evaluation of this video. 
Tell the creator clearly whether this video is good or not, what rating it deserves out of 100, specific timestamped events, and actionable steps to make it 10x better.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: videoBase64,
              },
            },
            {
              text: userPromptText,
            },
          ],
        },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict: {
                type: Type.STRING,
                description: "Short, punchy verdict title (e.g. 'Strong Content with High Potential', 'Good Concept - Needs Tighter Pacing', 'Exceptional Hook & Quality')",
              },
              isGoodVerdict: {
                type: Type.STRING,
                description: "Clear categorisation: 'Good', 'Promising (Needs Edits)', or 'Needs Major Rework'",
              },
              overallScore: {
                type: Type.NUMBER,
                description: "Overall quality rating from 0 to 100",
              },
              executiveSummary: {
                type: Type.STRING,
                description: "A comprehensive 2-3 paragraph summary reviewing the video's impact, emotional resonance, and viewer retention potential.",
              },
              scores: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.NUMBER, description: "Score 0-100 for hook power" },
                  pacing: { type: Type.NUMBER, description: "Score 0-100 for pacing and cut rhythm" },
                  audio: { type: Type.NUMBER, description: "Score 0-100 for audio clarity and sound design" },
                  visuals: { type: Type.NUMBER, description: "Score 0-100 for visual framing, lighting, b-roll" },
                  valueDelivery: { type: Type.NUMBER, description: "Score 0-100 for clarity and audience value" },
                  retentionPotential: { type: Type.NUMBER, description: "Score 0-100 for estimated viewer completion rate" },
                },
                required: ["hook", "pacing", "audio", "visuals", "valueDelivery", "retentionPotential"],
              },
              hookAnalysis: {
                type: Type.OBJECT,
                properties: {
                  hookRating: { type: Type.STRING, description: "e.g. 'Instant Grabber', 'Moderate Hook', 'Slow Start'" },
                  hookFeedback: { type: Type.STRING, description: "Detailed feedback on the first 3-5 seconds" },
                  suggestedAlternativeHooks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-3 high-retention alternative opening lines or visual hooks",
                  },
                },
                required: ["hookRating", "hookFeedback", "suggestedAlternativeHooks"],
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key strengths that make this video work well",
              },
              weaknesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Critical weaknesses or areas causing viewer drop-off",
              },
              timelineBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timestamp: { type: Type.STRING, description: "Timestamp string, e.g. '0:03' or '0:45'" },
                    seconds: { type: Type.NUMBER, description: "Timestamp converted to approximate seconds (e.g. 3, 45)" },
                    title: { type: Type.STRING, description: "Short title for this key moment" },
                    description: { type: Type.STRING, description: "What happens here and why it matters" },
                    type: {
                      type: Type.STRING,
                      description: "One of 'highlight', 'warning', 'opportunity', or 'neutral'",
                    },
                  },
                  required: ["timestamp", "seconds", "title", "description", "type"],
                },
                description: "Chronological moments with timestamps and notes",
              },
              actionableEdits: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    priority: { type: Type.STRING, description: "'High', 'Medium', or 'Low'" },
                    task: { type: Type.STRING, description: "Specific editing or presentation action" },
                    rationale: { type: Type.STRING, description: "Why this improves performance" },
                  },
                  required: ["priority", "task", "rationale"],
                },
                description: "Specific step-by-step editing suggestions",
              },
              audienceAndAlgorithm: {
                type: Type.OBJECT,
                properties: {
                  idealAudience: { type: Type.STRING, description: "Who this video is best suited for" },
                  algorithmAppeal: { type: Type.STRING, description: "How YouTube/TikTok/Reels algorithm will likely treat this content" },
                  dropoffRisks: { type: Type.STRING, description: "Where viewers are most likely to swipe away" },
                  suggestedTitles: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3-5 high-CTR title concepts",
                  },
                  suggestedTags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Target hashtags or keywords",
                  },
                },
                required: ["idealAudience", "algorithmAppeal", "dropoffRisks", "suggestedTitles", "suggestedTags"],
              },
            },
            required: [
              "verdict",
              "isGoodVerdict",
              "overallScore",
              "executiveSummary",
              "scores",
              "hookAnalysis",
              "strengths",
              "weaknesses",
              "timelineBreakdown",
              "actionableEdits",
              "audienceAndAlgorithm",
            ],
          },
        },
      });

      const responseText = response.text || "{}";
      const analysisData = JSON.parse(responseText);

      return res.json({
        success: true,
        modelUsed: "gemini-3.1-pro-preview",
        data: analysisData,
      });
    } catch (err: any) {
      console.error("Error analyzing video with gemini-3.1-pro-preview:", err);
      return res.status(500).json({
        error: err.message || "Failed to analyze video",
        details: err.toString(),
      });
    }
  });

  // Interactive Follow-up Chat with gemini-3.1-pro-preview about the video
  app.post("/api/chat-video", async (req, res) => {
    try {
      const { message, history = [], videoContext = {} } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getAiClient();

      const systemInstruction = `You are a dedicated Video Content Coach and Expert Editor discussing a video analysis report.
The user has analyzed their video with Gemini 3.1 Pro.
Here is the context of their video analysis:
Verdict: ${videoContext.verdict || "N/A"}
Score: ${videoContext.overallScore || "N/A"}/100
Strengths: ${JSON.stringify(videoContext.strengths || [])}
Weaknesses: ${JSON.stringify(videoContext.weaknesses || [])}
Summary: ${videoContext.executiveSummary || "N/A"}

Answer the user's specific questions with direct, creative, and highly tactical video production advice (e.g. scripting, cut points, sound design, thumbnail ideas, title copywriting, lighting setup, or audience retention psychology).`;

      const contents = [
        ...history.map((h: { role: string; content: string }) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        })),
        {
          role: "user",
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents,
        config: {
          systemInstruction,
        },
      });

      return res.json({
        reply: response.text || "I was unable to generate a response.",
      });
    } catch (err: any) {
      console.error("Chat error with gemini-3.1-pro-preview:", err);
      return res.status(500).json({
        error: err.message || "Failed to process chat message",
      });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Video Content Analyzer running on http://localhost:${PORT}`);
  });
}

startServer();
