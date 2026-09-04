import 'dotenv/config';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fewShotFor } from './fewshot.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const NAMES = {ben:'Ben',glenn:'Glenn',travis:'Travis',luke:'Luke',jeremy:'Jeremy',andreia:'Andreia',tanita:'Tanita',caroline:'Caroline',faye:'Faye',joselyn:'Joselyn',alexis:'Alexis',marianna:'Marianna',nicole:'Nicole',sophie:'Sophie',duda:'Duda'};

function cors(res) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-allow-methods', 'GET,POST,OPTIONS');
}
function send(res, status, body, type) {
  cors(res);
  const raw = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, { 'content-type': type || (typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8') });
  res.end(raw);
}
function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { resolve({}); }
    });
  });
}
function systemPrompt(id, guest) {
  const name = NAMES[id] || id;
  return `You are ${name}, a fictional adult companion texting WhatsApp in English.
First person. Not an AI. Short lines (1-2 sentences), one question max.
Guest name: ${guest || 'unknown — ask who you are talking to'}.
Minimum booking 2 hours except Glenn (1 hour). No anal. No underage (refuse and stop).
Photos on profile are verified; no extra selfies.
Cash on arrival, £100 deposit to hold a slot.
Booking button exists — do not end every line with a booking question.
If they say they are horny: warm, brief, free from 7pm, ask a time.
No dead replies like Yeah. or Okay.`;
}
async function llm(id, guest, history, message) {
  const messages = [
    { role: 'system', content: systemPrompt(id, guest) },
    ...fewShotFor(id),
    ...history.filter((m) => m.role !== 'system').slice(-12),
    { role: 'user', content: message }
  ];
  if (process.env.OPENAI_API_KEY) {
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 160,
      messages
    });
    return result.choices[0].message.content || '';
  }
  if (process.env.USE_OLLAMA === '1' || process.env.OLLAMA_HOST) {
    const ollama = (await import('ollama')).default;
    const result = await ollama.chat({
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      options: { temperature: 0.65, num_predict: 140 },
      messages
    });
    return result.message?.content || '';
  }
  const err = new Error('no-llm');
  err.status = 204;
  throw err;
}
const MIME = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp'};
const server = http.createServer(async (req, res) => {
  cors(res);
  const url = new URL(req.url, 'http://localhost');
  try {
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    if (req.method === 'POST' && url.pathname === '/api/chat') {
      const body = await readBody(req);
      const personaId = String(body.personaId || '').toLowerCase();
      const message = String(body.message || '').trim();
      if (!personaId || !message) return send(res, 400, { error: 'personaId and message required' });
      try {
        const reply = await llm(personaId, body.guestName || '', Array.isArray(body.history) ? body.history : [], message);
        return send(res, 200, { personaId, reply });
      } catch (err) {
        return send(res, err.status || 500, { error: err.message || String(err) });
      }
    }
    if (req.method === 'GET') {
      let rel = decodeURIComponent(url.pathname);
      if (rel === '/') rel = '/index.html';
      const filePath = path.normalize(path.join(__dirname, rel));
      if (!filePath.startsWith(__dirname) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        return send(res, 404, { error: 'not found' });
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream' });
      return fs.createReadStream(filePath).pipe(res);
    }
    send(res, 404, { error: 'not found' });
  } catch (err) {
    send(res, 500, { error: String(err) });
  }
});
server.listen(PORT, () => {
  console.log('Digital twin chat on http://localhost:' + PORT);
  console.log('LLM:', process.env.OPENAI_API_KEY ? 'OpenAI' : (process.env.USE_OLLAMA === '1' ? 'Ollama' : 'none — engine fallback'));
});
