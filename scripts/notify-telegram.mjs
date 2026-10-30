import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_DIR = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(WORKSPACE_DIR, '.env');
  const env = { ...process.env };
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!env[key]) env[key] = val;
      }
    }
  }
  return env;
}

const env = loadEnv();
const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN || '9163416030:AAEDSJSwLJf135QDY9QKidk6j76pPoDEFxs';
const CHAT_ID = env.TELEGRAM_ALLOWED_USER_ID || '1228975244';

const message = process.argv.slice(2).join(' ') || '🔔 Antigravity Workspace Alert';

async function notify() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    const data = await res.json();
    if (data.ok) {
      console.log('✅ Notification sent to Telegram.');
    } else {
      console.error('❌ Telegram error:', data);
    }
  } catch (err) {
    console.error('❌ Failed to send notification:', err.message);
  }
}

notify();
