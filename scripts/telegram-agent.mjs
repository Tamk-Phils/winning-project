import fs from 'node:fs';
import path from 'node:path';
import { exec, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_DIR = path.resolve(__dirname, '..');

// 1. Global Process Safety Handlers (Prevent Unhandled Crashes)
process.on('uncaughtException', (err) => {
  console.error('[Safety] Uncaught Exception:', err?.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Safety] Unhandled Rejection:', reason);
});

// 2. Load environment variables from .env
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
const ALLOWED_USER_ID = String(env.TELEGRAM_ALLOWED_USER_ID || '1228975244');
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

if (!BOT_TOKEN) {
  console.error('❌ Error: TELEGRAM_BOT_TOKEN is not configured.');
  process.exit(1);
}

// 3. Telegram API Helpers
async function callTelegram(method, payload) {
  try {
    const res = await fetch(`${TELEGRAM_API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram API error on ${method}:`, err.message);
    return { ok: false, error: err.message };
  }
}

async function sendTyping(chatId) {
  try {
    await callTelegram('sendChatAction', { chat_id: chatId, action: 'typing' });
  } catch {}
}

async function sendMessage(chatId, text, extra = {}) {
  const MAX_LEN = 3900;
  if (text.length <= MAX_LEN) {
    let res = await callTelegram('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      ...extra
    });
    // Fallback without Markdown if parsing error occurred
    if (!res.ok && res.description && res.description.includes("can't parse entities")) {
      res = await callTelegram('sendMessage', {
        chat_id: chatId,
        text,
        ...extra
      });
    }
    return res;
  }

  // Split into chunks
  const chunks = [];
  for (let i = 0; i < text.length; i += MAX_LEN) {
    chunks.push(text.slice(i, i + MAX_LEN));
  }
  let lastRes = { ok: true };
  for (const chunk of chunks) {
    lastRes = await callTelegram('sendMessage', {
      chat_id: chatId,
      text: chunk,
      ...extra
    });
  }
  return lastRes;
}

// 4. Command Exec Helper with Timeout Safeguard
function runShell(command, cwd = WORKSPACE_DIR, timeoutMs = 60000) {
  return new Promise((resolve) => {
    try {
      exec(command, { cwd, timeout: timeoutMs, maxBuffer: 1024 * 1024 * 4 }, (error, stdout, stderr) => {
        if (error && error.killed) {
          resolve({
            success: false,
            stdout: (stdout || '').trim(),
            stderr: '⏱️ Command execution timed out after 60 seconds.',
            exitCode: 124
          });
          return;
        }
        resolve({
          success: !error,
          stdout: (stdout || '').trim(),
          stderr: (stderr || '').trim(),
          exitCode: error ? error.code || 1 : 0
        });
      });
    } catch (err) {
      resolve({
        success: false,
        stdout: '',
        stderr: err?.message || 'Execution error',
        exitCode: 1
      });
    }
  });
}

// 5. Dev Server Lifecycle Manager
async function checkDevServer(timeoutMs = 1500) {
  try {
    const startTime = Date.now();
    const res = await fetch('http://localhost:5173/', { signal: AbortSignal.timeout(timeoutMs) });
    const latency = Date.now() - startTime;
    return { online: res.ok, status: res.status, latency };
  } catch {
    return { online: false, status: 0, latency: 0 };
  }
}

async function startDevServer(chatId) {
  const current = await checkDevServer(1000);
  if (current.online) {
    await sendMessage(
      chatId,
      `🟢 *Vite Dev Server is already online!*\n• Local URL: http://localhost:5173\n• Status: \`HTTP ${current.status} OK\` (${current.latency}ms)\n\n• Stop: \`/dev stop\`\n• Restart: \`/dev restart\``,
      MAIN_KEYBOARD
    );
    return;
  }

  await sendMessage(chatId, `🚀 *Launching Vite Dev Server in background...*\nCommand: \`npm run dev\``);

  try {
    const child = spawn('npm', ['run', 'dev'], {
      cwd: WORKSPACE_DIR,
      detached: true,
      stdio: 'ignore'
    });
    child.unref();

    // Poll for up to 8 seconds to confirm server readiness
    let ready = false;
    let latency = 0;
    for (let i = 0; i < 16; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const check = await checkDevServer(600);
      if (check.online) {
        ready = true;
        latency = check.latency;
        break;
      }
    }

    if (ready) {
      await sendMessage(
        chatId,
        `✅ *Vite Dev Server is Live & Responding!*\n• URL: http://localhost:5173\n• Port: \`5173\`\n• Status: \`HTTP 200 OK\` (${latency}ms)\n• PID: \`${child.pid}\`\n\nYou can test the web app or run \`/status\`.`,
        MAIN_KEYBOARD
      );
    } else {
      await sendMessage(
        chatId,
        `⚠️ *Dev server process started (PID: ${child.pid})*, but port 5173 is taking longer than usual to respond.\nCheck again with \`/dev\` in a moment.`,
        MAIN_KEYBOARD
      );
    }
  } catch (err) {
    await sendMessage(chatId, `❌ *Failed to spawn dev server:* ${err.message}`, MAIN_KEYBOARD);
  }
}

async function stopDevServer(chatId) {
  await sendMessage(chatId, `⏹️ *Stopping Vite Dev Server...*`);
  await runShell(`pkill -f 'node.*vite' || fuser -k 5173/tcp || true`);
  await new Promise((r) => setTimeout(r, 1000));
  const check = await checkDevServer(800);
  if (!check.online) {
    await sendMessage(chatId, `⚪ *Vite Dev Server stopped.* Port 5173 is now free.`, MAIN_KEYBOARD);
  } else {
    await sendMessage(chatId, `⚠️ *Dev server might still be stopping.* Run \`/dev\` to verify.`, MAIN_KEYBOARD);
  }
}

// 6. AgriFlow Produce Gate Catalog
function getCatalogData() {
  return [
    { name: 'Penja Protected White Pepper (PGI)', priceXaf: 14500, priceUsd: 24.15, unit: 'kg', stock: '850 kg', farm: 'Mbang Agro-Ecological' },
    { name: 'Foumbot Red Beefsteak Tomatoes', priceXaf: 900, priceUsd: 1.50, unit: 'kg', stock: '2,400 kg', farm: 'Noun Valley Cooperatives' },
    { name: 'Mountain French Green Beans', priceXaf: 1200, priceUsd: 2.00, unit: 'kg', stock: '1,100 kg', farm: 'Mount Cameroon Highlands' },
    { name: 'Heirloom Plantains (Big Ebanga)', priceXaf: 3500, priceUsd: 5.80, unit: 'bunch', stock: '420 bunches', farm: 'Mbang Agro-Ecological' },
    { name: 'Kumba Organic Ginger Roots', priceXaf: 1100, priceUsd: 1.85, unit: 'kg', stock: '1,600 kg', farm: 'Meme Heritage Farms' },
    { name: 'Penja Volcanic Raw Cocoa Pods', priceXaf: 2800, priceUsd: 4.65, unit: 'kg', stock: '3,200 kg', farm: 'Penja Valley Organic Estate' },
    { name: 'Bafoussam Sweet Bell Peppers', priceXaf: 1400, priceUsd: 2.30, unit: 'kg', stock: '950 kg', farm: 'Highland Cooperative' }
  ];
}

// 7. Intelligent AI Query Helper with Knowledge Integration
async function queryAiAssistant(userPrompt) {
  const providers = [
    { key: env.GROQ_API_KEY, url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile' },
    { key: env.OPENROUTER_API_KEY, url: 'https://openrouter.ai/api/v1/chat/completions', model: 'openai/gpt-oss-20b:free' },
    { key: env.DEEPSEEK_API_KEY, url: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat' }
  ];

  const systemInstruction = `You are Antigravity Remote Agent, an intelligent autonomous coding and agribusiness assistant paired with Phil.
Workspace: /home/philding/Desktop/apps/winning-project (AgriFlow: Cameroon agricultural exchange platform).
Platform Stack: React 19, TypeScript, Vite 8, Supabase, Vanilla CSS, Lucide icons.
Currency: Primary FCFA (XAF), Secondary USD ($1 ≈ 600 FCFA).
Be concise, accurate, helpful, and direct. Skip corporate fluff. Use clear markdown formatting.`;

  for (const p of providers) {
    if (!p.key || p.key === '...') continue;
    try {
      const res = await fetch(p.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${p.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: p.model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 800
        })
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch {
      // Try next provider
    }
  }

  // Fallback local agent response
  return `🤖 *Antigravity Remote Agent*\n\nReceived your query: "${userPrompt}".\n\nYour workspace is active at \`/home/philding/Desktop/apps/winning-project\`.\nUse /status, /build, /dev, /git, or /run <command> for workspace operations.`;
}

// 8. Main Interactive Mobile Keyboard
const MAIN_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '📊 Status' }, { text: '🔨 Build' }],
      [{ text: '⚡ Dev Server' }, { text: '📦 Git Status' }],
      [{ text: '🌾 Crop Prices' }, { text: '📋 Help' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

// 9. Message Router
async function handleMessage(message) {
  const chatId = message.chat.id;
  const fromId = String(message.from?.id || '');
  const username = message.from?.username || message.from?.first_name || 'User';
  const text = (message.text || '').trim();

  // Security Check: Restrict exclusively to Phil
  if (fromId !== ALLOWED_USER_ID) {
    console.warn(`[Security Alert] Blocked unauthorized message from ID: ${fromId} (@${username})`);
    await sendMessage(chatId, `⛔ *Access Denied*\n\nThis Antigravity Remote Agent is privately secured for Phil (ID: \`${ALLOWED_USER_ID}\`).\nYour ID: \`${fromId}\`.`);
    return;
  }

  console.log(`[Telegram] Phil (@${username}): ${text}`);
  await sendTyping(chatId);

  const lower = text.toLowerCase();

  // /start or /help or /menu
  if (lower === '/start' || lower === '/help' || lower === '/menu' || lower === '📋 help') {
    const welcome = `🚀 *Welcome back, Phil!*
*Antigravity Remote Agent is Active & Connected.*

📍 *Workspace:* \`/home/philding/Desktop/apps/winning-project\`
🌱 *Project:* AgriFlow Cameroon Agribusiness Exchange

*Available Remote Commands:*
• 📊 \`/status\` - Git branch, dev server health, disk & system telemetry
• 🔨 \`/build\` - Run full TypeScript + Vite production build
• ⚡ \`/dev\` - Check Vite dev server status
• ⚡ \`/dev start\` - Launch Vite dev server in background
• ⏹️ \`/dev stop\` - Stop Vite dev server (frees port 5173)
• 🔄 \`/dev restart\` - Cleanly restart Vite dev server
• 📦 \`/git <cmd>\` - Execute git commands (e.g. \`/git status\`, \`/git diff\`, \`/git push\`)
• 🌾 \`/crops\` or \`/price <name>\` - Check live produce gate prices (FCFA)
• 🚀 \`/run <command>\` - Execute any shell command in the workspace
• 💬 *Any regular text* - Query your Antigravity AI Assistant directly!

Use the buttons below for instant 1-tap actions:`;
    await sendMessage(chatId, welcome, MAIN_KEYBOARD);
    return;
  }

  // /status or button "📊 Status"
  if (lower === '/status' || lower === '📊 status') {
    const gitBranch = await runShell('git rev-parse --abbrev-ref HEAD');
    const gitChanges = await runShell('git status -s');
    const gitCommit = await runShell('git log -1 --pretty=format:"%h - %s (%cr)"');
    const diskInfo = await runShell("df -h . | tail -1 | awk '{print $4 \" free of \" $2}'");
    
    // Check local dev server
    const dev = await checkDevServer(1200);
    const devStatus = dev.online 
      ? `🟢 Online (http://localhost:5173, ${dev.latency}ms)`
      : `⚪ Offline (use /dev start)`;

    const changedCount = gitChanges.stdout ? gitChanges.stdout.split('\n').filter(Boolean).length : 0;

    const report = `📊 *Antigravity Workspace Status Report*

🌿 *Project:* AgriFlow Cameroon
📁 *Path:* \`${WORKSPACE_DIR}\`
🔀 *Git Branch:* \`${gitBranch.stdout || 'main'}\`
📝 *Working Tree:* ${changedCount === 0 ? '✅ Clean' : `⚠️ ${changedCount} modified file(s)`}
📌 *Last Commit:* ${gitCommit.stdout || 'N/A'}
⚡ *Dev Server:* ${devStatus}
💾 *Disk Space:* ${diskInfo.stdout || 'Available'}
🕒 *Server Time:* ${new Date().toLocaleTimeString()} (Cameroon/WAT)

${changedCount > 0 ? `*Modified files:*\n\`\`\`\n${gitChanges.stdout.slice(0, 500)}\n\`\`\`` : ''}`;

    await sendMessage(chatId, report, MAIN_KEYBOARD);
    return;
  }

  // /build or button "🔨 Build"
  if (lower === '/build' || lower === '🔨 build') {
    await sendMessage(chatId, '🔨 *Starting production build...*\n`tsc -b && vite build`\nPlease wait a moment.');
    const startTime = Date.now();
    const result = await runShell('npm run build');
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (result.success) {
      await sendMessage(chatId, `✅ *Build Succeeded in ${elapsed}s!*\n\n\`\`\`\n${result.stdout.slice(-1200)}\n\`\`\``, MAIN_KEYBOARD);
    } else {
      await sendMessage(chatId, `❌ *Build Failed (${elapsed}s)*\n\n\`\`\`\n${(result.stderr || result.stdout).slice(-1500)}\n\`\`\``, MAIN_KEYBOARD);
    }
    return;
  }

  // /dev commands
  if (lower === '/dev start') {
    await startDevServer(chatId);
    return;
  }

  if (lower === '/dev stop') {
    await stopDevServer(chatId);
    return;
  }

  if (lower === '/dev restart') {
    await stopDevServer(chatId);
    await startDevServer(chatId);
    return;
  }

  // /dev status or "⚡ Dev Server"
  if (lower === '/dev' || lower === '⚡ dev server' || lower === '/dev status' || lower === '/server') {
    const dev = await checkDevServer(1800);
    if (dev.online) {
      await sendMessage(
        chatId,
        `🟢 *Vite Dev Server is Live!*\n• URL: http://localhost:5173\n• Status: \`HTTP ${dev.status} OK\`\n• Latency: \`${dev.latency}ms\`\n• Port: \`5173\`\n\nCommands:\n• Stop: \`/dev stop\`\n• Restart: \`/dev restart\``,
        MAIN_KEYBOARD
      );
    } else {
      await sendMessage(
        chatId,
        `⚪ *Vite Dev Server is currently Offline*\nPort 5173 is idle.\n\n👉 Send \`/dev start\` to launch it now in the background!`,
        MAIN_KEYBOARD
      );
    }
    return;
  }

  // /git or "📦 Git Status"
  if (lower.startsWith('/git') || lower === '📦 git status') {
    const subCmd = lower === '📦 git status' ? 'status -s' : text.replace(/^\/git\s*/i, '').trim() || 'status';
    const result = await runShell(`git ${subCmd}`);
    const out = result.stdout || result.stderr || '(no output)';
    await sendMessage(chatId, `📦 *git ${subCmd}*\n\`\`\`\n${out.slice(0, 3000)}\n\`\`\``, MAIN_KEYBOARD);
    return;
  }

  // /crops or /price or button "🌾 Crop Prices"
  if (lower === '/crops' || lower === '🌾 crop prices' || lower.startsWith('/price')) {
    const catalog = getCatalogData();
    const query = text.replace(/^\/price\s*/i, '').trim().toLowerCase();

    const filtered = query 
      ? catalog.filter(c => c.name.toLowerCase().includes(query) || c.farm.toLowerCase().includes(query))
      : catalog;

    if (filtered.length === 0) {
      await sendMessage(chatId, `🔍 No crops found matching "${query}".\nTry: \`/crops\` to see all produce.`, MAIN_KEYBOARD);
      return;
    }

    let list = `🌾 *AgriFlow Live Produce Gate Prices:*\n\n`;
    for (const item of filtered) {
      list += `• *${item.name}*\n  💵 *${item.priceXaf.toLocaleString()} FCFA* (~$${item.priceUsd.toFixed(2)}) / ${item.unit}\n  📦 Available: ${item.stock} • _${item.farm}_\n\n`;
    }
    list += `_Prices reflect live farm-gate agreements across Moungo & Noun corridors._`;

    await sendMessage(chatId, list, MAIN_KEYBOARD);
    return;
  }

  // /run <command>
  if (lower.startsWith('/run ')) {
    const cmd = text.slice(5).trim();
    if (!cmd) {
      await sendMessage(chatId, '⚠️ Please provide a command. Example: `/run git log -n 3`');
      return;
    }

    // Intercept dev server commands so they run safely as background daemon
    if (cmd === 'npm run dev' || cmd === 'vite' || cmd === 'npx vite' || cmd === 'npm start') {
      await startDevServer(chatId);
      return;
    }

    // Intercept dev server stop command
    if (cmd === 'kill vite' || cmd === 'npm run dev stop' || cmd === 'stop dev') {
      await stopDevServer(chatId);
      return;
    }

    await sendMessage(chatId, `⚙️ *Executing:* \`${cmd}\`...`);
    const startTime = Date.now();
    const result = await runShell(cmd);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    const out = result.stdout || result.stderr || '(command completed with no output)';
    const statusIcon = result.success ? '✅' : '❌';

    await sendMessage(chatId, `${statusIcon} *Result (${elapsed}s) [Exit Code: ${result.exitCode}]:*\n\`\`\`\n${out.slice(0, 3500)}\n\`\`\``, MAIN_KEYBOARD);
    return;
  }

  // Fallback: Conversational AI Prompting
  const aiAnswer = await queryAiAssistant(text);
  await sendMessage(chatId, aiAnswer, MAIN_KEYBOARD);
}

// 10. Long-Polling Loop with Auto-Recovery
let lastUpdateId = 0;
let isPolling = true;

async function pollUpdates() {
  while (isPolling) {
    try {
      const data = await callTelegram('getUpdates', {
        offset: lastUpdateId + 1,
        timeout: 30,
        allowed_updates: ['message']
      });

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = update.update_id;
          if (update.message) {
            handleMessage(update.message).catch((err) => {
              console.error('Error handling message:', err);
            });
          }
        }
      } else if (!data.ok) {
        console.warn('Telegram getUpdates returned not ok:', data);
        await new Promise((r) => setTimeout(r, 3000));
      }
    } catch (err) {
      console.error('Polling connection warning:', err?.message || err);
      await new Promise((r) => setTimeout(r, 4000));
    }
  }
}

// 11. Startup & Handshake
async function startBot() {
  console.log(`🤖 Starting Antigravity Telegram Agent...`);
  console.log(`👤 Target User ID: ${ALLOWED_USER_ID}`);
  console.log(`📂 Project Directory: ${WORKSPACE_DIR}`);

  const me = await callTelegram('getMe', {});
  if (me.ok) {
    console.log(`✅ Connected as @${me.result.username} (${me.result.first_name})`);
  } else {
    console.error('❌ Failed to verify bot token with Telegram:', me);
    process.exit(1);
  }

  // Send update notification to Phil
  const bootMsg = `🚀 *Antigravity Remote Agent Connected!*

Hello Phil! Your workspace daemon is online and listening.
• Branch: \`main\`
• Workspace: \`${WORKSPACE_DIR}\`
• Dev server control: \`/dev start\`, \`/dev stop\`, \`/dev restart\`
• Type \`/help\` or tap buttons below to start.`;

  const handshake = await sendMessage(ALLOWED_USER_ID, bootMsg, MAIN_KEYBOARD);
  if (!handshake.ok) {
    console.log(`ℹ️ User has not initiated conversation with @${me.result.username} yet.`);
    console.log(`👉 Please open https://t.me/${me.result.username} and press "Start".`);
  } else {
    console.log(`📱 Push handshake successfully delivered to Phil's Telegram!`);
  }

  // Start continuous polling loop
  await pollUpdates();
}

// Keep process active with periodic heartbeat
setInterval(() => {
  console.log(`[Heartbeat] Antigravity Telegram Agent polling... (${new Date().toLocaleTimeString()})`);
}, 300000);

// Handle termination signals cleanly
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping Telegram Agent daemon...');
  isPolling = false;
  process.exit(0);
});

process.on('SIGTERM', () => {
  isPolling = false;
  process.exit(0);
});

startBot();
