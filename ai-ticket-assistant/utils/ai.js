import {createAgent, gemini} from "@inngest/agent-kit"

const analyzeTicket = async (ticket) => {
    const supportAgent = createAgent({
        model: gemini({
            model: "gemini-1.5-flash-8b",
            apiKey: process.env.GEMINI_API_KEY,
        }),
        name: "AI Ticket Triage Assistant",
        system: `You are an expert AI assistant that processes technical support tickets. 

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

IMPORTANT:
- Respond with *only* valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object.

Repeat: Do not wrap your output in markdown or code fences.`
});

const response = await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
        
Analyze the following support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
- relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

{
"summary": "Short summary of the ticket",
"priority": "high",
"helpfulNotes": "Here are useful tips...",
"relatedSkills": ["React", "Node.js"]
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`);

// Try to normalize the agent response across possible shapes
let raw = "";
try {
  // Common shapes observed across agent-kit versions
  raw =
    response?.outputText ||
    response?.text ||
    response?.output?.[0]?.context ||
    response?.output?.[0]?.content ||
    response?.output ||
    (Array.isArray(response?.messages)
      ? response.messages[response.messages.length - 1]?.content
      : "") ||
    "";
} catch {
  raw = "";
}

if (typeof raw !== "string") {
  try {
    // If the SDK already returned an object, use it as-is
    if (raw && typeof raw === "object") {
      return raw;
    }
  } catch {}
}

let jsonString = String(raw || "").trim();
try {
  return JSON.parse(jsonString);
} catch {
  // Strip code fences or extra text; extract the first JSON object
  const fenceStripped = jsonString
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(fenceStripped);
  } catch {}

  const match = jsonString.match(/{[\s\S]*}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }
  console.warn("AI response could not be parsed as JSON. Raw value (truncated):", String(jsonString).slice(0, 300));
  return null;
}

};

export default analyzeTicket;