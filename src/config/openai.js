// Lightweight OpenAI Chat API helper (fallback when backend/proxies fail)

/**
 * Sends a chat message to OpenAI and returns the assistant reply text.
 * Expects the API key in Vite env var VITE_OPENAI_API_KEY.
 */
export async function sendOpenAIMessage({ message, history = [], model = 'gpt-4o-mini' }) {
  const apiKey = import.meta.env?.VITE_OPENAI_API_KEY || window?.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key missing. Set VITE_OPENAI_API_KEY in .env.local');
  }

  const messages = [];
  for (const m of history) {
    if (!m || !m.role || !m.content) continue;
    const role = m.role === 'assistant' ? 'assistant' : 'user';
    messages.push({ role, content: String(m.content).slice(0, 8000) });
  }
  messages.push({ role: 'user', content: String(message).slice(0, 8000) });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI: empty response');
  return content;
}


