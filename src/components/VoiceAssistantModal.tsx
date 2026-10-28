import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Check, 
  Sparkles, 
  ArrowRight,
  Sliders
} from 'lucide-react';
import type { VoiceLanguage, AppView, Product, DemandOpportunity } from '../types';
import { askAgriFlowAssistant } from '../lib/aiAssistant';
import { playSpokenText, stopSpokenText, initializeVoiceEngine, getAvailableVoices, type VoiceEngineMode } from '../lib/speechUtils';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
  onAddProduceVoice?: (produceName: string, quantity: number, priceXaf: number) => void;
  products: Product[];
  opportunities: DemandOpportunity[];
  unreadNotificationCount: number;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onAddProduceVoice,
  products: _products,
  opportunities,
  unreadNotificationCount,
}) => {
  const [language, setLanguage] = useState<VoiceLanguage>('pcm'); // Default to Cameroonian Pidgin for local accessibility
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [assistantResponse, setAssistantResponse] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<{
    description: string;
    action: () => void;
  } | null>(null);
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);

  // High quality voice selection states
  const [voiceMode, setVoiceMode] = useState<VoiceEngineMode>(() => {
    try {
      return (localStorage.getItem('agriflow_voice_mode') as VoiceEngineMode) || 'natural';
    } catch {
      return 'natural';
    }
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>(() => getAvailableVoices());
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(() => {
    try {
      return localStorage.getItem('agriflow_voice_uri') || '';
    } catch {
      return '';
    }
  });
  const [voiceSpeed, setVoiceSpeed] = useState<number>(0.94);
  const [isVoicePickerOpen, setIsVoicePickerOpen] = useState<boolean>(false);

  // Initialize and listen to voice readiness
  useEffect(() => {
    initializeVoiceEngine((voices) => {
      setAvailableVoices(voices);
    });
    setAvailableVoices(getAvailableVoices());
  }, []);

  // Cleanup on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stopSpokenText();
    }
    return () => {
      stopSpokenText();
    };
  }, [isOpen]);

  // Initial welcome greeting depending on language
  useEffect(() => {
    if (isOpen) {
      const greeting = language === 'pcm'
        ? "How far! Welcome. You dey look for buyers, wan put harvest for market, or check wetin dey happen? How I fit help you today?"
        : "Hey there, welcome! Looking for buyers, want to list fresh produce, or need help finding something? What's on your mind?";
      
      setAssistantResponse(greeting);
      speakText(greeting);
    }
  }, [isOpen, language]);

  // High clarity speech synthesis helper with phonetic normalization
  const speakText = (text: string) => {
    if (typeof window === 'undefined') return;

    playSpokenText(
      text,
      language === 'pcm' ? 'pcm' : 'en',
      {
        engineMode: voiceMode,
        voiceURI: selectedVoiceURI,
        rate: voiceSpeed,
        pitch: 0.98,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      }
    );
  };

  const handleTestVoice = (voiceUriToTest?: string) => {
    const uri = voiceUriToTest || selectedVoiceURI;
    const testPhrase = language === 'pcm'
      ? "How far! Voice don set well well. Ready to assist you for AgriFlow."
      : "Hello! My voice is clear and ready to assist you on AgriFlow.";
    
    playSpokenText(
      testPhrase,
      language === 'pcm' ? 'pcm' : 'en',
      {
        engineMode: voiceMode,
        voiceURI: uri,
        rate: voiceSpeed,
        pitch: 0.98,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      }
    );
  };

  const handleStopSpeaking = () => {
    stopSpokenText();
    setIsSpeaking(false);
  };

  // Web Speech Recognition
  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const fallbackMsg = language === 'pcm'
        ? "Your browser no support microphone speech recognition directly. Click any of di quick buttons below make we talk!"
        : "Speech recognition isn't supported in this browser. Please use the quick buttons below.";
      setAssistantResponse(fallbackMsg);
      speakText(fallbackMsg);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening... Speak now...');
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
        processVoiceCommand(spoken);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('Could not hear clearly. Try clicking a quick topic below.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Natural Language Understanding & Command Processing
  const processVoiceCommand = async (command: string) => {
    const text = command.toLowerCase();

    // 1. Search Buyer Requests / Demand Radar
    if (text.includes('buyer') || text.includes('demand') || text.includes('find market') || text.includes('order')) {
      const resp = language === 'pcm'
        ? `Check out Demand Radar! We get ${opportunities.length} active buyer requests open right now. You wan make I open di page for you?`
        : `Sure thing! Right now there are ${opportunities.length} active buyer requests on the radar. Want me to open that up for you?`;
      
      setAssistantResponse(resp);
      speakText(resp);

      setPendingAction({
        description: language === 'pcm' ? 'Open Demand Radar Page' : 'Navigate to Demand Radar',
        action: () => {
          onNavigate('demand_radar');
          onClose();
        }
      });
      return;
    }

    // 2. List Harvest / Sell Produce
    if (text.includes('sell') || text.includes('list') || text.includes('plantain') || text.includes('harvest') || text.includes('produce')) {
      const resp = language === 'pcm'
        ? "No wahala! I fit help you set up di batch — like 500kg of Fresh Green Plantains at 400 FCFA per kilo. Check am below and click make we publish am."
        : "Sounds good! I can get that batch ready for you — let's say 500kg of Fresh Green Plantains at 400 FCFA per kilo. Take a quick look below and confirm to publish.";

      setAssistantResponse(resp);
      speakText(resp);

      setPendingAction({
        description: language === 'pcm' 
          ? 'Confirm Action: Publish 500kg Plantains at 400 FCFA/kg' 
          : 'Confirm: Publish 500kg Plantains at 400 FCFA/kg',
        action: () => {
          if (onAddProduceVoice) {
            onAddProduceVoice('Fresh Green Plantains', 500, 400);
          }
          onNavigate('farmer_portal');
          onClose();
        }
      });
      return;
    }

    // 3. Live Chat / Messages
    if (text.includes('message') || text.includes('chat') || text.includes('inbox') || text.includes('talk')) {
      const resp = language === 'pcm'
        ? `You get ${unreadNotificationCount} new message${unreadNotificationCount === 1 ? '' : 's'} waiting for you. You wan make we open live chat?`
        : `You've got ${unreadNotificationCount} new message${unreadNotificationCount === 1 ? '' : 's'} waiting for you. Want me to take you to live chat?`;

      setAssistantResponse(resp);
      speakText(resp);

      setPendingAction({
        description: 'Open Live Chat Inbox',
        action: () => {
          onNavigate('live_chat');
          onClose();
        }
      });
      return;
    }

    setIsAssistantThinking(true);
    try {
      const response = await askAgriFlowAssistant({
        message: command,
        language,
        context: {
          productCount: _products.length,
          opportunityCount: opportunities.length,
          unreadNotificationCount,
        },
      });
      setAssistantResponse(response.message);
      speakText(response.message);
    } catch {
      const friendlyError = language === 'pcm'
        ? "Network small slow, but I dey right here! Wetin you wan check?"
        : "I had a little trouble getting that just now, but I'm right here. What would you like to check out?";
      setAssistantResponse(friendlyError);
      speakText(friendlyError);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 27, 17, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1300,
      padding: '20px'
    }}>
      <div 
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(18px, 4vw, 28px)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Header & Language Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                AgriFlow Voice Assistant
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Accessibility Speech Helper for Farmers
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Language Selector */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', padding: '2px' }}>
              <button
                type="button"
                onClick={() => setLanguage('pcm')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: language === 'pcm' ? 'var(--primary-700)' : 'transparent',
                  color: language === 'pcm' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                Pidgin (CM)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: language === 'en' ? 'var(--primary-700)' : 'transparent',
                  color: language === 'en' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsVoicePickerOpen(!isVoicePickerOpen)}
              style={{
                background: isVoicePickerOpen ? 'var(--primary-100)' : 'none',
                border: 'none',
                cursor: 'pointer',
                color: isVoicePickerOpen ? 'var(--primary-800)' : 'var(--text-muted)',
                padding: '6px',
                borderRadius: '8px'
              }}
              title="Voice Synthesizer Settings"
            >
              <Sliders size={18} />
            </button>

            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Voice Selection & Sound Tuning Drawer */}
        {isVoicePickerOpen && (
          <div style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '14px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.82rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: '#86efac', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                🎙️ Voice Quality & Accent
              </span>
              <button
                type="button"
                onClick={() => handleTestVoice()}
                style={{
                  backgroundColor: 'rgba(52, 211, 153, 0.2)',
                  color: '#86efac',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Test Voice
              </button>
            </div>

            {/* Voice Mode Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
                Audio Engine Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceMode('natural');
                    try { localStorage.setItem('agriflow_voice_mode', 'natural'); } catch {}
                  }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: voiceMode === 'natural' ? '1.5px solid #34d399' : '1px solid #334155',
                    backgroundColor: voiceMode === 'natural' ? 'rgba(52, 211, 153, 0.2)' : '#1e293b',
                    color: voiceMode === 'natural' ? '#86efac' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  ✨ Human Studio Voice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceMode('browser');
                    try { localStorage.setItem('agriflow_voice_mode', 'browser'); } catch {}
                  }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: voiceMode === 'browser' ? '1.5px solid #34d399' : '1px solid #334155',
                    backgroundColor: voiceMode === 'browser' ? 'rgba(52, 211, 153, 0.2)' : '#1e293b',
                    color: voiceMode === 'browser' ? '#86efac' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  💻 Device Synthesizer
                </button>
              </div>
              <div style={{ fontSize: '0.7rem', color: voiceMode === 'natural' ? '#86efac' : '#94a3b8', marginTop: '4px' }}>
                {voiceMode === 'natural' 
                  ? 'Ultra-smooth studio human voice — zero metallic robotic artifacts.' 
                  : 'Using your operating system local TTS voice.'}
              </div>
            </div>

            {voiceMode === 'browser' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                  Synthesizer Voice ({availableVoices.length} detected)
                </label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => {
                    const uri = e.target.value;
                    setSelectedVoiceURI(uri);
                    try {
                      localStorage.setItem('agriflow_voice_uri', uri);
                    } catch {
                      // ignore
                    }
                    handleTestVoice(uri);
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    border: '1px solid #334155',
                    fontSize: '0.78rem'
                  }}
                >
                  <option value="">✨ Best Natural Voice (Automatic)</option>
                  {availableVoices.map((v) => (
                    <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Speed:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  { label: 'Warm 0.88x', val: 0.88 },
                  { label: 'Natural 0.94x', val: 0.94 },
                  { label: 'Brisk 1.05x', val: 1.05 }
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => setVoiceSpeed(s.val)}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: voiceSpeed === s.val ? '#10b981' : '#1e293b',
                      color: voiceSpeed === s.val ? '#ffffff' : '#94a3b8'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Central Audio Microphone Button */}
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <button
            type="button"
            onClick={handleToggleListening}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: isListening ? '#dc2626' : 'var(--primary-700)',
              color: '#ffffff',
              border: 'none',
              boxShadow: isListening 
                ? '0 0 24px rgba(220, 38, 38, 0.6)' 
                : '0 8px 24px rgba(20, 94, 60, 0.4)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              transform: isListening ? 'scale(1.08)' : 'scale(1)'
            }}
          >
            {isListening ? <MicOff size={38} className="pulse-fast" /> : <Mic size={38} />}
          </button>

          <div style={{ marginTop: '12px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-950)' }}>
            {isListening 
              ? (language === 'pcm' ? 'I dey hear you... Talk now!' : 'Listening... Speak clearly') 
              : (language === 'pcm' ? 'Press microphone make you talk' : 'Tap microphone to speak')}
          </div>
          {transcript && (
            <div style={{ marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              "{transcript}"
            </div>
          )}
        </div>

        {/* Assistant Response Bubble */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          color: 'var(--text-main)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase' }}>
              AgriFlow Assistant Response
            </span>
            {isSpeaking ? (
              <button
                type="button"
                onClick={handleStopSpeaking}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  background: 'none',
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <VolumeX size={14} /> Stop Speaking
              </button>
            ) : (
              <button
                type="button"
                onClick={() => speakText(assistantResponse)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  background: 'none',
                  color: 'var(--primary-700)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Volume2 size={14} /> Listen Again
              </button>
            )}
          </div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {isAssistantThinking ? 'Thinking...' : assistantResponse}
          </p>
        </div>

        {/* Action Confirmation Safeguard */}
        {pendingAction && (
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '2px solid #34d399',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#065f46' }}>
              <Check size={16} />
              <span>Confirmation Required Before Action:</span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#047857', fontWeight: 600 }}>
              {pendingAction.description}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  pendingAction.action();
                  setPendingAction(null);
                }}
                className="btn btn-primary"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Yes, Proceed</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Quick Voice Prompt Suggestions */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '8px' }}>
            {language === 'pcm' ? 'Quick Topics (Click to ask):' : 'Suggested Questions:'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(language === 'pcm' ? [
              "A beg, which buyer dem dey find plantain or pepper?",
              "Help me put 500kg of green plantains for market",
              "Check my unread message from European buyers"
            ] : [
              "Show me all active buyer requests on Demand Radar",
              "Prepare a listing for 500kg of Green Plantains",
              "Read my latest buyer inquiries in Live Chat"
            ]).map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTranscript(prompt);
                  processVoiceCommand(prompt);
                }}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all var(--trans-fast)'
                }}
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
