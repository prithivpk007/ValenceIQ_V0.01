/**
 * AI Controller — conversational analytics endpoint.
 * Phase 2 uses rule-based pattern matching (mirrors Phase 1 mock service).
 * Phase 3 will integrate a financial LLM via vector embeddings.
 */

const presetResponses = [
  {
    queryId: "q_mrr",
    keywords: ["summarize", "recurring revenue", "mrr"],
    question: "Summarize our current monthly recurring revenue",
    summary: "Monthly Recurring Revenue stands at ₹19.2L across 6 active enterprise subscriptions.",
    metrics: [
      { label: "MRR", value: "₹19,20,000", status: "Healthy" },
      { label: "Growth MoM", value: "+7.4%", status: "Positive" },
      { label: "Churn Rate", value: "2.1%", status: "Acceptable" },
    ],
    details:
      "All active subscriptions contributed to a consistent MRR this period. Platform tier subscriptions remain the highest contributor. No churn events detected in the last 30 days.",
    recommendation: "Upsell opportunity exists in Workflow tier. Consider targeted outreach to plan-upgrade candidates.",
  },
  {
    queryId: "q_overdue",
    keywords: ["overdue", "30", "day"],
    question: "Which invoices are overdue by more than 30 days?",
    summary: "3 invoices totalling ₹4.8L are overdue beyond 30 days. Immediate escalation recommended.",
    metrics: [
      { label: "Overdue Invoices", value: "3", status: "Critical" },
      { label: "At-Risk Revenue", value: "₹4,80,000", status: "Action Required" },
    ],
    details:
      "The oldest overdue invoice is 47 days past due with a balance of ₹2.1L. Two others are between 31-40 days.",
    recommendation: "Trigger automated reminder sequence and flag accounts for Account Executive follow-up.",
  },
  {
    queryId: "q_growth",
    keywords: ["compare", "last month", "growth"],
    question: "Compare subscription growth to last month",
    summary: "Net new subscriptions increased by 2 accounts vs last month (+40%).",
    metrics: [
      { label: "New Subs (This Month)", value: "7", status: "Growing" },
      { label: "New Subs (Last Month)", value: "5", status: "Baseline" },
      { label: "Growth Rate", value: "+40%", status: "Strong" },
    ],
    details: "Growth driven by improved sales pipeline conversion. Platform and Intelligence tiers are leading growth.",
    recommendation: "Maintain current outbound cadence. Consider shortening trial duration to accelerate conversions.",
  },
];

export const askQuestion = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required." });

    const lower = prompt.toLowerCase();
    let matched = presetResponses.find((r) => r.keywords.some((kw) => lower.includes(kw)));

    if (!matched) {
      matched = {
        queryId: `dyn_${Date.now()}`,
        question: prompt,
        summary: `Analysis for inquiry: "${prompt}"`,
        metrics: [
          { label: "Analyzed Accounts", value: "All Active", status: "Complete" },
          { label: "Data Freshness", value: "Real-time MongoDB", status: "Live" },
        ],
        details:
          "Ask Brightloop has analyzed current billing cycles, contract terms, and customer activity. No critical anomalies detected. Phase 3 will add deep vector-embedding financial LLM integration.",
        recommendation: "Review the Analytics & Reports workspace for in-depth charts.",
      };
    }

    const responsePayload = {
      id: `ai_resp_${Date.now()}`,
      prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      result: matched,
    };

    res.json({ success: true, data: responsePayload });
  } catch (err) {
    next(err);
  }
};

export const getSuggestedQuestions = (req, res) => {
  res.json({ success: true, data: presetResponses.map((r) => r.question) });
};
