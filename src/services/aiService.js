import { mockAiPresetResponses } from "../data/mockData";
import { mockDelay, createApiResponse } from "./apiClient";

class AiService {
  constructor() {
    this.history = [];
  }

  async askQuestion(prompt) {
    await mockDelay(600); // Simulate thinking time
    const lower = prompt.toLowerCase();

    // Check for matched preset query
    let matched = null;
    if (lower.includes("summarize") || lower.includes("recurring revenue") || lower.includes("mrr")) {
      matched = mockAiPresetResponses[0];
    } else if (lower.includes("overdue") && (lower.includes("30") || lower.includes("day"))) {
      matched = mockAiPresetResponses[1];
    } else if (lower.includes("compare") || lower.includes("last month") || lower.includes("growth")) {
      matched = mockAiPresetResponses[2];
    } else if (lower.includes("repeated") || lower.includes("late") || lower.includes("risk")) {
      matched = mockAiPresetResponses[3];
    } else if (lower.includes("draft") || lower.includes("reminder") || lower.includes("email")) {
      matched = mockAiPresetResponses[4];
    } else {
      // General dynamic query response
      matched = {
        queryId: `dyn_${Date.now()}`,
        question: prompt,
        summary: `Analysis for inquiry: "${prompt}"`,
        metrics: [
          { label: "Analyzed Accounts", value: "6 Subscriptions", status: "Active Scope" },
          { label: "Data Freshness", value: "Real-time Mock DB", status: "Phase 1 Cache" },
        ],
        details: `Ask Brightloop has analyzed current billing cycles, contract terms, and customer activity logs. No critical anomalies detected outside normal operating thresholds. In Phase 2, this copilot will connect with deep vector embeddings and fine-tuned financial LLMs.`,
        recommendation: "Review the Analytics & Reports workspace for deep multi-dimensional charts.",
      };
    }

    const responsePayload = {
      id: `ai_resp_${Date.now()}`,
      prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      result: matched,
    };

    this.history.push(responsePayload);
    return createApiResponse(responsePayload);
  }

  getSuggestedQuestions() {
    return mockAiPresetResponses.map((r) => r.question);
  }

  getHistory() {
    return this.history;
  }
}

export const aiService = new AiService();
