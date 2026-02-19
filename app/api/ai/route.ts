import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const limiter = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 20;

const rateLimit = (key: string) => {
  const now = Date.now();
  const current = limiter.get(key);

  if (!current || current.resetAt < now) {
    limiter.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (current.count >= MAX_REQUESTS_PER_MINUTE) return false;
  current.count += 1;
  return true;
};

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for") ?? "local";
    if (!rateLimit(forwardedFor)) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    const { prompt, context, mode } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response("Missing GEMINI_API_KEY", { status: 500 });
    }

    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-flash" });

    const composedPrompt = `You are CodeFusion AI Assistant. Mode: ${mode}.\nUse concise, production-safe guidance.\nContext:\n${context ?? "No context"}\n\nUser prompt:\n${prompt}`;

    const stream = await model.generateContentStream(composedPrompt);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream.stream) {
          controller.enqueue(encoder.encode(chunk.text()));
        }
        controller.close();
      }
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Unknown error", { status: 500 });
  }
}
