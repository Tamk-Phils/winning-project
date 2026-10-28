import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import https from 'node:https'
import type { IncomingMessage, ServerResponse } from 'node:http'

function ttsProxyPlugin(): Plugin {
  return {
    name: 'tts-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/tts', handleTtsRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/tts', handleTtsRequest);
    }
  };
}

function handleTtsRequest(req: IncomingMessage, res: ServerResponse) {
  try {
    const reqUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    const text = reqUrl.searchParams.get('q') || reqUrl.searchParams.get('text') || '';
    const lang = reqUrl.searchParams.get('tl') || reqUrl.searchParams.get('lang') || 'en';

    if (!text) {
      res.statusCode = 400;
      res.end('Missing text query parameter');
      return;
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text)}`;

    const googleReq = https.get(
      ttsUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*'
        }
      },
      (googleRes) => {
        if (googleRes.statusCode !== 200) {
          res.statusCode = googleRes.statusCode || 500;
          res.end('Upstream TTS error');
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        });

        googleRes.pipe(res);
      }
    );

    googleReq.on('error', (err) => {
      console.error('TTS proxy error:', err);
      res.statusCode = 502;
      res.end('TTS gateway error');
    });
  } catch (err) {
    console.error('TTS handler error:', err);
    res.statusCode = 500;
    res.end('Internal error');
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ttsProxyPlugin()],
})

