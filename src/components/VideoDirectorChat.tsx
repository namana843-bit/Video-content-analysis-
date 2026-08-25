import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, HelpCircle } from "lucide-react";
import { ChatMessage, VideoAnalysisData } from "../types";

interface VideoDirectorChatProps {
  analysisData: VideoAnalysisData;
}

export function VideoDirectorChat({ analysisData }: VideoDirectorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      content: `Hi! I've analyzed your video using **Gemini 3.1 Pro**. You scored **${analysisData.overallScore}/100** with the verdict: *"${analysisData.verdict}"*. 
      
Ask me anything about your video! For example:
- *"How can I make the first 3 seconds punchier?"*
- *"Can you rewrite my script outro to get more comments?"*
- *"What b-roll shots should I film to replace the slow middle section?"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (customPromptText?: string) => {
    const textToSend = customPromptText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          videoContext: {
            verdict: analysisData.verdict,
            overallScore: analysisData.overallScore,
            strengths: analysisData.strengths,
            weaknesses: analysisData.weaknesses,
            executiveSummary: analysisData.executiveSummary,
          },
        }),
      });

      const resData = await response.json();

      if (resData.reply) {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: resData.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(resData.error || "Failed to generate reply");
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I ran into an issue answering your question. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Write 3 viral opening lines for this topic",
    "How do I fix the pacing drop at the middle?",
    "Give me 3 thumbnail concepts for this video",
    "What music vibe & sound effects should I add?",
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col h-[540px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>AI Video Director Chat</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-md border border-indigo-200 uppercase tracking-wider">
                Gemini 3.1 Pro
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Ask follow-up questions, request script rewrites, or get thumbnail strategies
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
        {messages.map((msg) => {
          const isBot = msg.role === "assistant";
          return (
            <div key={msg.id} className={`flex items-start space-x-2.5 ${isBot ? "" : "flex-row-reverse space-x-reverse"}`}>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs ${
                  isBot ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"
                }`}
              >
                {isBot ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                  isBot
                    ? "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs"
                    : "bg-indigo-600 text-white rounded-tr-xs shadow-2xs"
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.content}</div>
                <div className={`text-[10px] mt-1.5 ${isBot ? "text-slate-400" : "text-indigo-200 font-mono"}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center space-x-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Gemini 3.1 Pro is brainstorming recommendations...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 pt-1 shrink-0">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-[11px] font-medium bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 transition-colors flex items-center gap-1 shadow-2xs"
          >
            <HelpCircle className="w-3 h-3 text-slate-400" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center space-x-2 pt-2 border-t border-slate-100 shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask AI Director about your video hook, cuts, audio, or title..."
          disabled={isLoading}
          className="flex-1 bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

