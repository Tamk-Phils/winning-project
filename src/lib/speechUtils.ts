// Speech synthesis & phonetic normalization utilities for AgriFlow Voice Assistant

export type VoiceEngineMode = 'natural' | 'browser';

/**
 * Phonetically cleans text before sending it to Web Speech API or any TTS engine.
 * Strips markdown, emojis, converts agricultural acronyms, currencies, and technical terms
 * to spoken, natural language to prevent robotic phonetic garble.
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Remove markdown bold, italic, strikethrough, headers, links
  text = text.replace(/[*_~`#]/g, ' ');
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // markdown links [text](url) -> text
  text = text.replace(/^>+\s*/gm, ''); // blockquotes
  text = text.replace(/^[-*+]\s+/gm, ''); // bullet points

  // 2. Remove all emojis and unicode pictographs (which cause TTS to speak emoji names)
  text = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}]/gu, '');

  // 3. Agricultural & West African regional abbreviations & currencies
  text = text.replace(/\bFCFA\/kg\b/gi, 'francs per kilo');
  text = text.replace(/\bXAF\/kg\b/gi, 'CFA francs per kilo');
  text = text.replace(/\bFCFA\b/gi, 'francs CFA');
  text = text.replace(/\bXAF\b/gi, 'CFA francs');
  text = text.replace(/\bCFA\b/gi, 'CFA francs');
  
  // 4. Units of measure
  text = text.replace(/\b\/kg\b/gi, ' per kilo');
  text = text.replace(/\b\/ha\b/gi, ' per hectare');
  text = text.replace(/(\d+)\s*kg\b/gi, '$1 kilos');
  text = text.replace(/(\d+)\s*ha\b/gi, '$1 hectares');
  text = text.replace(/(\d+)\s*MT\b/gi, '$1 metric tons');
  text = text.replace(/(\d+)\s*km\b/gi, '$1 kilometers');
  text = text.replace(/(\d+)\s*°C\b/gi, '$1 degrees Celsius');
  text = text.replace(/(\d+)\s*HP\b/gi, '$1 horsepower');
  text = text.replace(/\b4WD\b/gi, 'four wheel drive');
  text = text.replace(/\b2WD\b/gi, 'two wheel drive');

  // 5. Technical & Agricultural Acronyms
  text = text.replace(/\bPGI\b/g, 'P G I');
  text = text.replace(/\bGAP\b/g, 'Good Agricultural Practices');
  text = text.replace(/\bMINADER\b/g, 'Ministry of Agriculture');
  text = text.replace(/\bIoT\b/g, 'Internet of Things');
  text = text.replace(/\bGPS\b/g, 'G P S');
  text = text.replace(/\bRFQ\b/g, 'request for quotation');
  text = text.replace(/\bCSA\b/g, 'community supported agriculture');
  text = text.replace(/\bB2B\b/g, 'business to business');

  // 6. Common abbreviations
  text = text.replace(/\be\.g\.,?\b/gi, 'for example');
  text = text.replace(/\bi\.e\.,?\b/gi, 'that is');
  text = text.replace(/\bapprox\.,?\b/gi, 'approximately');
  text = text.replace(/\bvs\.\b/gi, 'versus');
  text = text.replace(/\bhr\b/gi, 'hour');
  text = text.replace(/\bhrs\b/gi, 'hours');
  text = text.replace(/\bmin\b/gi, 'minutes');

  // 7. Symbols cleanup
  text = text.replace(/&/g, ' and ');
  text = text.replace(/\+/g, ' plus ');
  text = text.replace(/\//g, ' or ');

  // 8. Clean up extra punctuation, excessive whitespace, and trim
  text = text.replace(/[()\[\]{}"'“”]/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Splits text into natural sentence or phrase chunks (each under maxLen characters)
 * for high-quality audio streaming.
 */
export function chunkTextForTTS(text: string, maxLen = 190): string[] {
  if (!text) return [];
  // Split on sentence boundaries first
  const rawSentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let buffer = '';

  for (const sentence of rawSentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if ((buffer + ' ' + trimmed).trim().length <= maxLen) {
      buffer = (buffer + ' ' + trimmed).trim();
    } else {
      if (buffer) {
        chunks.push(buffer);
        buffer = '';
      }
      if (trimmed.length <= maxLen) {
        buffer = trimmed;
      } else {
        // Split on comma or semicolon
        const clauses = trimmed.split(/([,;]+)/);
        let clauseBuffer = '';
        for (const clause of clauses) {
          if ((clauseBuffer + clause).length <= maxLen) {
            clauseBuffer += clause;
          } else {
            if (clauseBuffer.trim()) chunks.push(clauseBuffer.trim());
            clauseBuffer = clause;
          }
        }
        if (clauseBuffer.trim()) buffer = clauseBuffer.trim();
      }
    }
  }

  if (buffer.trim()) chunks.push(buffer.trim());
  return chunks;
}

// Active audio playback tracking
let currentAudio: HTMLAudioElement | null = null;
let activeChunkQueue: string[] = [];
let isPlaybackCancelled = false;

/**
 * Stops any active speech audio or Web Speech synthesis immediately.
 */
export function stopSpokenText(): void {
  isPlaybackCancelled = true;
  activeChunkQueue = [];

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
    } catch {
      // Ignore
    }
    currentAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

/**
 * Gets all available synthesis voices asynchronously, registering onvoiceschanged
 * if not already populated.
 */
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoadedListeners: Array<(voices: SpeechSynthesisVoice[]) => void> = [];

export function initializeVoiceEngine(onVoicesReady?: (voices: SpeechSynthesisVoice[]) => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  if (onVoicesReady) {
    voicesLoadedListeners.push(onVoicesReady);
  }

  const update = () => {
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        cachedVoices = v;
        voicesLoadedListeners.forEach(listener => listener(cachedVoices));
      }
    } catch {
      // Ignore in unsupported environments
    }
  };

  update();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = update;
  }
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
  return cachedVoices;
}

/**
 * Finds the highest quality, most natural sounding voice available for the given language.
 */
export function selectBestVoice(
  voices: SpeechSynthesisVoice[], 
  language: 'en' | 'fr' | 'pcm' = 'en',
  preferredVoiceURI?: string
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // If user selected a specific voice URI, use that first
  if (preferredVoiceURI && preferredVoiceURI !== 'natural_google') {
    const userChoice = voices.find(v => v.voiceURI === preferredVoiceURI || v.name === preferredVoiceURI);
    if (userChoice) return userChoice;
  }

  // Desired keywords for natural, neural, and premium voices
  const highQualityKeywords = ['natural', 'neural', 'google', 'online', 'premium', 'samantha', 'daniel', 'karen', 'victoria', 'arthur', 'serena', 'oliver', 'alva'];

  // African English or Nigerian English for Pidgin if available
  if (language === 'pcm') {
    const afroVoice = voices.find(v => 
      (v.lang.includes('NG') || v.lang.includes('GH') || v.lang.includes('ZA') || v.lang.includes('KE'))
    );
    if (afroVoice) return afroVoice;
  }

  // French preferred voices
  if (language === 'fr') {
    const frenchNatural = voices.find(v => 
      v.lang.startsWith('fr') && highQualityKeywords.some(k => v.name.toLowerCase().includes(k))
    );
    if (frenchNatural) return frenchNatural;

    const frenchDefault = voices.find(v => v.lang.startsWith('fr'));
    if (frenchDefault) return frenchDefault;
  }

  // English natural voices
  const englishNatural = voices.find(v => 
    v.lang.startsWith('en') && highQualityKeywords.some(k => v.name.toLowerCase().includes(k))
  );
  if (englishNatural) return englishNatural;

  // Fallback to any English voice that is not robotic eSpeak if possible
  const nonEspeakEnglish = voices.find(v => 
    v.lang.startsWith('en') && !v.name.toLowerCase().includes('espeak')
  );
  if (nonEspeakEnglish) return nonEspeakEnglish;

  // Fallback to default or first voice
  return voices.find(v => v.default) || voices[0] || null;
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceURI?: string;
  engineMode?: VoiceEngineMode;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * High quality speech synthesis runner with phonetic cleaning, Google neural voice stream,
 * and seamless fallback to Web Speech API.
 */
export function playSpokenText(
  text: string, 
  language: 'en' | 'fr' | 'pcm' = 'en',
  options: SpeakOptions = {}
): void {
  // Always stop any running audio first
  stopSpokenText();
  isPlaybackCancelled = false;

  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) {
    options.onEnd?.();
    return;
  }

  const engineMode = options.engineMode ?? 'natural';

  // Strategy A: If Natural Voice stream is preferred (default), use Google Neural TTS
  if (engineMode === 'natural' && typeof window !== 'undefined') {
    const chunks = chunkTextForTTS(cleanedText);
    if (chunks.length === 0) {
      options.onEnd?.();
      return;
    }

    activeChunkQueue = [...chunks];
    options.onStart?.();

    const langCode = language === 'fr' ? 'fr' : 'en';

    const playNextChunk = () => {
      if (isPlaybackCancelled || activeChunkQueue.length === 0) {
        currentAudio = null;
        options.onEnd?.();
        return;
      }

      const chunk = activeChunkQueue.shift()!;
      // Use local high-fidelity TTS proxy to prevent upstream CORS/Referer blocking
      const url = `/api/tts?tl=${langCode}&q=${encodeURIComponent(chunk)}`;

      const audio = new Audio(url);
      audio.playbackRate = options.rate ?? 0.98;
      audio.volume = options.volume ?? 1.0;
      currentAudio = audio;

      // Pre-buffer next chunk in background for gapless, continuous speech
      if (activeChunkQueue.length > 0) {
        const nextChunk = activeChunkQueue[0];
        const nextUrl = `/api/tts?tl=${langCode}&q=${encodeURIComponent(nextChunk)}`;
        const preloadAudio = new Audio(nextUrl);
        preloadAudio.preload = 'auto';
        preloadAudio.load();
      }

      audio.onended = () => {
        playNextChunk();
      };

      audio.onerror = () => {
        // Fallback to Web Speech API if network audio fails
        playViaWebSpeech(cleanedText, language, options);
      };

      audio.play().catch(() => {
        // Fallback if browser autoplay policies block Audio.play()
        playViaWebSpeech(cleanedText, language, options);
      });
    };

    playNextChunk();
    return;
  }

  // Strategy B: Browser Web Speech API
  playViaWebSpeech(cleanedText, language, options);
}

function playViaWebSpeech(
  cleanedText: string,
  language: 'en' | 'fr' | 'pcm',
  options: SpeakOptions
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onEnd?.();
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = options.rate ?? 0.94;
    utterance.pitch = options.pitch ?? 0.98;
    utterance.volume = options.volume ?? 1.0;
    utterance.lang = language === 'fr' ? 'fr-FR' : (language === 'pcm' ? 'en-NG' : 'en-US');

    const voices = getAvailableVoices();
    const voice = selectBestVoice(voices, language, options.voiceURI);
    if (voice) {
      utterance.voice = voice;
    }

    if (options.onStart) utterance.onstart = () => options.onStart!();
    if (options.onEnd) utterance.onend = () => options.onEnd!();
    if (options.onError) utterance.onerror = (e) => options.onError!(e);

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    options.onError?.(err);
    options.onEnd?.();
  }
}
