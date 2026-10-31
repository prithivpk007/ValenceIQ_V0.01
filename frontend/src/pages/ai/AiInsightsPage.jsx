import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { aiService } from "../../services/aiService";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  FileText,
  Clock,
} from "lucide-react";

export const AiInsightsPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatBottomRef = useRef(null);

  const suggestedQuestions = aiService.getSuggestedQuestions();

  useEffect(() => {
    // Initial greeting and welcome prompt
    setMessages([
      {
        id: "msg_welcome",
        sender: "ai",
        timestamp: "Just now",
        result: {
          summary: "Welcome to ValenceIQ — AI Financial Analyst Copilot",
          details:
            "I can analyze customer payment patterns, calculate MRR trajectories, detect overdue invoice anomalies, and draft customized collection notices. Pick a suggested question below or submit a custom inquiry.",
          metrics: [
            { label: "Active Analyzed Accounts", value: "6 Subscriptions", status: "Indexed" },
            { label: "Confidence Rating", value: "100% Mock DB", status: "Deterministic" },
          ],
          recommendation: "Try asking about overdue accounts or comparing month-over-month cash collections.",
        },
      },
    ]);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (queryText) => {
    const text = queryText || inputPrompt;
    if (!text.trim()) return;

    // Append user question
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const res = await aiService.askQuestion(text);
      const aiMsg = {
        id: res.data.id,
        sender: "ai",
        timestamp: res.data.timestamp,
        result: res.data.result,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ValenceIQ — AI Financial Analyst"
        description="Natural-language operational copilot for cash collection reconciliation, churn forecasting, and billing risk audits."
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Intelligence Active
            </span>
          </div>
        }
      />

      {/* Strict Phase 1 Notice & Financial Truth Disclaimer */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Important Financial Truth Disclaimer:</span> AI-assisted insights in ValenceIQ are consultative and predictive. AI outputs must never be considered the legal or statutory source of financial truth; all collections and invoices are reconciled against verified bank ledgers and GAAP billing registers.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Suggested Queries & Source Filter Context */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Suggested Inquiries
            </h3>
            <p className="text-2xs text-slate-500 mb-3">
              Click any verified prompt to run automated analysis:
            </p>
            <div className="space-y-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50/70 hover:border-blue-200 text-xs text-slate-700 hover:text-blue-900 transition-colors cursor-pointer group flex items-start gap-2"
                >
                  <span className="text-3xs font-mono font-bold text-blue-600 bg-white border border-blue-100 rounded px-1 mt-0.5 shrink-0">
                    Q{idx + 1}
                  </span>
                  <span className="text-2xs leading-snug">{q}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-slate-900 text-white border-none">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Copilot Context
            </h4>
            <div className="space-y-2 text-2xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Model Engine:</span>
                <span className="font-mono text-blue-400 font-semibold">ValenceIQ Engine v1</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Data Source:</span>
                <span>Active Subscriptions</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Fiscal Period:</span>
                <span>October 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Integration Phase:</span>
                <span className="text-emerald-400">Phase 1 (Mock API)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Interactive Chat Interface */}
        <div className="lg:col-span-3 flex flex-col h-[650px] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Workspace Conversation Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isAi
                        ? "bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-sm"
                        : "bg-slate-800 text-white"
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Message Card */}
                  <div className={`space-y-2.5 grow ${isAi ? "text-left" : "text-right"}`}>
                    {/* Header info */}
                    <div className="flex items-center gap-2 text-3xs text-slate-400">
                      <span className="font-semibold text-slate-700">{isAi ? "ValenceIQ Copilot" : "You"}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Content */}
                    {!isAi ? (
                      <div className="p-3 bg-blue-600 text-white rounded-2xl rounded-tr-none text-xs font-medium inline-block text-left shadow-xs">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="p-5 bg-white border border-slate-200/90 rounded-2xl rounded-tl-none shadow-xs space-y-3.5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                            {msg.result.summary}
                          </h4>
                          <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                            Verified Analysis
                          </span>
                        </div>

                        {/* Metric Highlights if provided */}
                        {msg.result.metrics && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {msg.result.metrics.map((m, mi) => (
                              <div key={mi} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-3xs uppercase font-medium text-slate-400 block truncate">
                                  {m.label}
                                </span>
                                <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                                  {m.value}
                                </span>
                                <span className="text-3xs text-blue-600 font-semibold">{m.status || m.change}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Text explanation */}
                        {msg.result.details && (
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                            {msg.result.details}
                          </p>
                        )}

                        {/* Draft message if present */}
                        {msg.result.draft && (
                          <div className="relative p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                            <button
                              onClick={() => handleCopyText(msg.id, msg.result.draft)}
                              className="absolute top-2.5 right-2.5 p-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs flex items-center gap-1 text-2xs cursor-pointer"
                              title="Copy to clipboard"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy
                                </>
                              )}
                            </button>
                            {msg.result.draft}
                          </div>
                        )}

                        {/* Actionable recommendation */}
                        {msg.result.recommendation && (
                          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
                            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Next Recommended Action: </span>
                              {msg.result.recommendation}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 max-w-lg mr-auto text-left">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-xs text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  Synthesizing financial statements, subscription terms, and payment risk...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Prompt Input Form */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about recurring revenue, overdue invoices, churn risks, or draft emails..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all disabled:opacity-60"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputPrompt.trim() || isLoading}
                icon={Send}
              >
                Send
              </Button>
            </form>
            <div className="flex items-center justify-between mt-2 text-3xs text-slate-400">
              <span>ValenceIQ Financial Analyst uses structured deterministic intelligence.</span>
              <span>Protected Enterprise Sandbox</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
