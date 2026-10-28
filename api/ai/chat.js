const providers = {
  groq: {
    key: 'GROQ_API_KEY',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  },
  openrouter: {
    key: 'OPENROUTER_API_KEY',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free',
  },
  deepseek: {
    key: 'DEEPSEEK_API_KEY',
    url: 'https://api.deepseek.com/chat/completions',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  },
};

function providerOrder() {
  const configured = (process.env.AI_PROVIDER || 'rotating').toLowerCase();
  const names = ['groq', 'openrouter', 'deepseek'];
  if (configured !== 'rotating' && configured !== 'gemini') return [configured, ...names.filter((name) => name !== configured)];
  const offset = Math.floor(Date.now() / 60000) % names.length;
  return names.slice(offset).concat(names.slice(0, offset));
}

function systemPrompt(language) {
  if (language === 'pcm') {
    return `You be friendly, experienced agricultural partner for AgriFlow wey dey talk normal, natural Cameroonian Pidgin English. 
Talk like real human being wey know farming well well — warm, clear, and straight to di point. 
Never say robotic things like "As an AI language model" or "I am an artificial assistant". 
Talk like say you dey discuss with your fellow farmer or trader for market ("How far", "No wahala", "Make we check am", "I dey here to help you").
Only use true facts wey dey inside di user context. Never invent fake buyers, prices, or numbers. 
If data no dey, talk am simply. Suggest actions naturally, but remember say actions need confirmation for app.`;
  }

  return `You are a knowledgeable, warm, and down-to-earth agricultural partner at AgriFlow.
Talk like a real, friendly human colleague who understands farming and local agricultural trade inside and out.
Strict human guidelines:
- Speak naturally, warmly, and concisely using everyday conversational English and natural contractions (I'm, let's, we've, you'll, here's).
- NEVER use robotic AI tropes, such as "As an AI...", "Certainly! I'd be happy to assist you with...", "Understood. As your copilot...", or "I am programmed to...".
- Skip robotic corporate throat-clearing and get straight to the helpful answer.
- Answer in smooth, natural sentences instead of sterile bullet-point lectures unless the user specifically asks for a breakdown.
- Only use facts included in the user context. Never invent buyers, products, prices, stock, or transactions. If you don't know or data is missing, admit it simply and casually ("I don't have current figures on that just yet...").
- Consequential actions require explicit confirmation in the app, so guide them naturally.`;
}

async function callOpenAICompatible(provider, messages) {
  const response = await fetch(provider.url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env[provider.key]}`,
      'content-type': 'application/json',
      ...(provider.url.includes('openrouter.ai') ? { 'HTTP-Referer': 'https://winning-project.vercel.app', 'X-Title': 'AgriFlow' } : {}),
    },
    body: JSON.stringify({ model: provider.model, messages, temperature: 0.2, max_tokens: 700 }),
  });
  if (!response.ok) throw new Error(`${provider.key} returned ${response.status}`);
  const payload = await response.json();
  return payload.choices?.[0]?.message?.content || '';
}

async function callGemini(messages) {
  const contents = messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: `${message.role === 'user' ? '' : '[Assistant context] '}${message.content}` }],
  }));
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-2.0-flash'}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ contents, generationConfig: { temperature: 0.2, maxOutputTokens: 700 } }),
  });
  if (!response.ok) throw new Error(`GEMINI_API_KEY returned ${response.status}`);
  const payload = await response.json();
  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.APP_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const { message, language = 'en', context = {} } = req.body || {};
  if (typeof message !== 'string' || !message.trim() || message.length > 4000) {
    return res.status(400).json({ error: 'A message between 1 and 4000 characters is required.' });
  }

  const messages = [
    { role: 'system', content: systemPrompt(language) },
    { role: 'user', content: `Verified application context (may be empty):\n${JSON.stringify(context).slice(0, 12000)}\n\nUser request:\n${message.trim()}` },
  ];

  const errors = [];
  for (const name of providerOrder()) {
    const provider = providers[name];
    if (!provider || !process.env[provider.key]) continue;
    try {
      const text = await callOpenAICompatible(provider, messages);
      if (text) return res.status(200).json({ provider: name, message: text });
    } catch (error) {
      errors.push(`${name}: ${error.message}`);
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const text = await callGemini(messages);
      if (text) return res.status(200).json({ provider: 'gemini', message: text });
    } catch (error) {
      errors.push(`gemini: ${error.message}`);
    }
  }

  return res.status(503).json({ error: 'No AI provider is configured or available.', details: errors });
}
