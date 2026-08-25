/**
 * Utility to generate lightweight animated canvas video clips for instant demo testing
 * if a user wants to test without uploading a local file.
 */

export async function generateDemoVideoBlob(type: "tech" | "cooking" | "fitness" | "vlog"): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 1280; // 9:16 vertical reel
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not supported");

  const stream = canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm",
  });

  const chunks: BlobPart[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      resolve(new Blob(chunks, { type: "video/webm" }));
    };

    mediaRecorder.start();
    const startTime = performance.now();
    const duration = 4000; // 4 seconds demo clip

    const titles = {
      tech: {
        hook: "STOP BUYING THIS PHONE! ❌",
        point: "Here's what they won't tell you about the battery life.",
        cta: "Link in bio for the real test!",
        color1: "#0f172a",
        color2: "#3b82f6",
      },
      cooking: {
        hook: "Crispy 5-Minute Garlic Pasta 🍝",
        point: "The secret is emulsifying the pasta water with cold butter.",
        cta: "Save this recipe for dinner!",
        color1: "#1c1917",
        color2: "#f97316",
      },
      fitness: {
        hook: "Fix Your Squat Form Right Now 🏋️",
        point: "Stop letting your knees cave in on the upward push.",
        cta: "Follow for daily lifting cues!",
        color1: "#18181b",
        color2: "#10b981",
      },
      vlog: {
        hook: "A Day in Tokyo with $20 🇯🇵",
        point: "Found this hidden ramen spot tucked behind Shinjuku station.",
        cta: "Drop your favorite spot in comments!",
        color1: "#1e1b4b",
        color2: "#ec4899",
      },
    };

    const info = titles[type];

    function drawFrame(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Background Gradient
      const grad = ctx!.createLinearGradient(0, 0, 0, 1280);
      grad.addColorStop(0, info.color1);
      grad.addColorStop(1, info.color2);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, 720, 1280);

      // Animated graphic elements
      ctx!.fillStyle = "rgba(255, 255, 255, 0.08)";
      for (let i = 0; i < 5; i++) {
        const offset = ((elapsed / 1000) * 80 + i * 260) % 1280;
        ctx!.beginPath();
        ctx!.arc(360 + Math.sin(elapsed / 800 + i) * 150, offset, 120 + i * 20, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Title & Hook text
      ctx!.fillStyle = "#ffffff";
      ctx!.textAlign = "center";

      // Badge
      ctx!.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx!.roundRect?.(160, 200, 400, 50, 25);
      ctx!.fill();
      ctx!.fillStyle = "#fef08a";
      ctx!.font = "bold 24px sans-serif";
      ctx!.fillText("CONTENT CREATOR REEL DEMO", 360, 234);

      // Main Hook
      ctx!.fillStyle = "#ffffff";
      ctx!.font = "bold 44px sans-serif";
      ctx!.fillText(info.hook, 360, 420);

      // Animated visual focus card
      ctx!.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx!.roundRect?.(80, 500, 560, 360, 20);
      ctx!.fill();

      ctx!.fillStyle = "#e2e8f0";
      ctx!.font = "30px sans-serif";
      ctx!.fillText("Key Insight at 0:02", 360, 580);

      ctx!.fillStyle = "#93c5fd";
      ctx!.font = "26px sans-serif";
      // wrap text
      ctx!.fillText(info.point.slice(0, 32), 360, 660);
      ctx!.fillText(info.point.slice(32), 360, 700);

      // Call to action
      ctx!.fillStyle = "#fbbf24";
      ctx!.font = "bold 32px sans-serif";
      ctx!.fillText(info.cta, 360, 960);

      // Progress bar at bottom
      ctx!.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx!.fillRect(60, 1180, 600, 12);
      ctx!.fillStyle = "#38bdf8";
      ctx!.fillRect(60, 1180, 600 * progress, 12);

      if (progress < 1) {
        requestAnimationFrame(drawFrame);
      } else {
        mediaRecorder.stop();
      }
    }

    requestAnimationFrame(drawFrame);
  });
}
