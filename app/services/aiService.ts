import { ChatMessage } from "@/app/types/project";

interface AIRequest {
  prompt: string;
  context?: string;
  mode: "chat" | "explain" | "fix" | "refactor" | "generate";
}

export const aiService = {
  async streamResponse(payload: AIRequest, onChunk: (text: string) => void) {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok || !response.body) {
      const error = await response.text();
      throw new Error(error || "AI request failed");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
  },

  buildContext(messages: ChatMessage[], activeCode?: string) {
    return [
      "Conversation:",
      ...messages.map((message) => `${message.role}: ${message.content}`),
      activeCode ? `\nActive file:\n${activeCode}` : ""
    ].join("\n");
  }
};
