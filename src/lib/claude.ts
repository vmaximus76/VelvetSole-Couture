export async function refinePromptWithClaude(inputPrompt: string): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY is not configured");

  const apiUrl = process.env.CLAUDE_API_URL?.trim() || "https://api.anthropic.com/v1/complete";
  const model = process.env.CLAUDE_MODEL || "claude-2.1";

  const systemPrefix = `You are an expert prompt engineer for AI video/image generation models. Given a user prompt, rewrite it to be concise, descriptive, and optimized for a Wan2.2 I2V-style generator. Return only the rewritten prompt as plain text, with no surrounding explanation.`;

  const body = {
    model,
    prompt: `${systemPrefix}\n\nUser prompt:\n${inputPrompt}\n\nAssistant:`,
    max_tokens: 800,
    temperature: 0.2,
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Claude API error: ${res.status} ${text}`);
  }

  const data = await res.json().catch(() => null);
  // Anthropic "complete" response historically returns `completion` or `completion`-like fields.
  // Be defensive: try common fields, fallback to raw text.
  const candidate = (data && (data.completion || data.completions?.[0]?.data?.text || data.output)) || null;
  if (candidate && typeof candidate === "string") return candidate.trim();

  // If response format differs, try reading `text` or `result` keys, otherwise fallback
  if (data && typeof data === "object") {
    for (const k of ["text", "result", "response"]) {
      if (typeof (data as any)[k] === "string") return (data as any)[k].trim();
    }
  }

  // Last resort: return original prompt
  return inputPrompt;
}

export default refinePromptWithClaude;
