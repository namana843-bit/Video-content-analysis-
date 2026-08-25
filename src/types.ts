export interface VideoAnalysisScores {
  hook: number;
  pacing: number;
  audio: number;
  visuals: number;
  valueDelivery: number;
  retentionPotential: number;
}

export interface HookAnalysis {
  hookRating: string;
  hookFeedback: string;
  suggestedAlternativeHooks: string[];
}

export interface TimelineMoment {
  timestamp: string;
  seconds: number;
  title: string;
  description: string;
  type: "highlight" | "warning" | "opportunity" | "neutral";
}

export interface ActionableEdit {
  priority: "High" | "Medium" | "Low" | string;
  task: string;
  rationale: string;
}

export interface AudienceAlgorithm {
  idealAudience: string;
  algorithmAppeal: string;
  dropoffRisks: string;
  suggestedTitles: string[];
  suggestedTags: string[];
}

export interface VideoAnalysisData {
  verdict: string;
  isGoodVerdict: "Good" | "Promising (Needs Edits)" | "Needs Major Rework" | string;
  overallScore: number;
  executiveSummary: string;
  scores: VideoAnalysisScores;
  hookAnalysis: HookAnalysis;
  strengths: string[];
  weaknesses: string[];
  timelineBreakdown: TimelineMoment[];
  actionableEdits: ActionableEdit[];
  audienceAndAlgorithm: AudienceAlgorithm;
}

export interface AnalysisResponse {
  success: boolean;
  modelUsed: string;
  data: VideoAnalysisData;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SampleVideoOption {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  aspectRatio: "9:16" | "16:9";
  demoUrl?: string;
  badge: string;
}
