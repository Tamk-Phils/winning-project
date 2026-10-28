import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Minus, 
  CheckCircle2, 
  RotateCcw,
  Bot,
  AlertCircle
} from 'lucide-react';
import type { AppView, VoiceLanguage, Product, DemandOpportunity } from '../types';
import { askAgriFlowAssistant, detectActionFromMessage, type AssistantAction } from '../lib/aiAssistant';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionExecuted?: string;
}

interface AIAssistantWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
  onOpenCart?: () => void;
  onOpenNotifications?: () => void;
  onOpenSupabase?: () => void;
  onSearch?: (query: string) => void;
  onAddProduceVoice?: (produceName: string, quantity: number, priceXaf: number) => void;
  products: Product[];
  opportunities: DemandOpportunity[];
  unreadNotificationCount: number;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCart,
  onOpenNotifications,
  onOpenSupabase,
  onSearch,
  products,
  opportunities,
  unreadNotificationCount,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [language, setLanguage] = useState<VoiceLanguage>('en');
  // Speech enabled by default with real voice responses
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Inactivity / Liveness check state
  const [showLivenessPrompt, setShowLivenessPrompt] = useState<boolean>(false);
  const [livenessSecondsLeft, setLivenessSecondsLeft] = useState<number>(3);
  const inactivityTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello! I am your AgriFlow AI Copilot. Ask me farming questions, or tell me to 'open supplier dashboard', 'open services', or 'find buyer demands' and I will navigate in the background.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Clean up all liveness timers on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) window.clearTimeout(inactivityTimerRef.current);
      if (countdownTimerRef.current) window.clearInterval(countdownTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const resetLivenessTimers = () => {
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setShowLivenessPrompt(false);
    setLivenessSecondsLeft(3);
  };

  const scheduleLivenessCheck = () => {
    resetLivenessTimers();
    // After 6 seconds of inactivity, prompt the user
    inactivityTimerRef.current = window.setTimeout(() => {
      setShowLivenessPrompt(true);
      setLivenessSecondsLeft(3);
      speakText("Are you still available to continue the chat?");

      let remaining = 3;
      countdownTimerRef.current = window.setInterval(() => {
        remaining -= 1;
        setLivenessSecondsLeft(remaining);
        if (remaining <= 0) {
          if (countdownTimerRef.current) {
            window.clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          setShowLivenessPrompt(false);
          setIsListening(false);
          // Assistant remains docked and quiet on the page
        }
      }, 1000);
    }, 6000);
  };

  // Speech Synthesis helper
  const speakText = (text: string, onEnd?: () => void) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = language === 'pcm' ? 'en-NG' : 'en-US';

    utterance.onend = () => {
      onEnd?.();
    };
    utterance.onerror = () => {
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  const executeAction = (action?: AssistantAction): string | undefined => {
    if (!action) return undefined;

    // Block admin portal opening
    if (action.type === 'block_admin') {
      return "Admin access restricted - cannot be opened via assistant";
    }

    if (action.type === 'navigate' && action.target) {
      // Execute in background; assistant stays open and docked
      onNavigate(action.target);
      return action.label;
    }
    if (action.type === 'open_cart' && onOpenCart) {
      onOpenCart();
      return action.label;
    }
    if (action.type === 'open_notifications' && onOpenNotifications) {
      onOpenNotifications();
      return action.label;
    }
    if (action.type === 'open_supabase' && onOpenSupabase) {
      onOpenSupabase();
      return action.label;
    }
    if (action.type === 'search' && action.query && onSearch) {
      onSearch(action.query);
      return action.label;
    }
    return undefined;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    resetLivenessTimers();
    setInputText('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // Check if immediate command can be executed right now
    const immediateAction = detectActionFromMessage(text);
    let executedLabel: string | undefined;
    if (immediateAction) {
      executedLabel = executeAction(immediateAction);
    }

    try {
      const response = await askAgriFlowAssistant({
        message: text,
        language,
        context: {
          productCount: products.length,
          opportunityCount: opportunities.length,
          unreadNotificationCount,
        }
      });

      // If response has an action that wasn't executed yet, execute it
      if (response.action && !executedLabel) {
        executedLabel = executeAction(response.action);
      }

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        sender: 'assistant',
        text: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionExecuted: executedLabel || response.action?.label
      };

      setMessages(prev => [...prev, assistantMsg]);
      
      // Speak aloud and start liveness timer when speech concludes
      speakText(response.message, () => {
        scheduleLivenessCheck();
      });
    } catch {
      const fallbackText = "I am ready to assist. You can ask me to open services, supplier portal, or marketplace, or check crop prices.";
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionExecuted: executedLabel
      };
      setMessages(prev => [...prev, errorMsg]);
      speakText(fallbackText, () => {
        scheduleLivenessCheck();
      });
    } finally {
      setIsThinking(false);
    }
  };

  // Speech Recognition toggle
  const handleToggleMic = () => {
    resetLivenessTimers();
    if (isListening) {
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Microphone recognition is not supported in this browser. Please type your message.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'pcm' ? 'en-US' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setInputText(spoken);
        handleSendMessage(spoken);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleResetChat = () => {
    resetLivenessTimers();
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: language === 'pcm'
          ? "A beg! I be your AgriFlow AI Copilot. Wetin you wan make I open or check for market today?"
          : "Hello! What page would you like me to open, or what farming questions can I help you with?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) {
    return null;
  }

  // Minimized state: sleek floating pill
  if (isMinimized) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        animation: 'fadeIn 0.2s ease'
      }}>
        <button
          type="button"
          onClick={() => {
            setIsMinimized(false);
            resetLivenessTimers();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-900)',
            color: '#ffffff',
            border: '2px solid rgba(52, 211, 153, 0.4)',
            boxShadow: 'var(--shadow-xl)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.88rem'
          }}
        >
          <Sparkles size={17} color="#86efac" />
          <span>AgriFlow Copilot</span>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#34d399',
            boxShadow: '0 0 8px #34d399'
          }} />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="AgriFlow AI Assistant"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: 'min(400px, calc(100vw - 32px))',
        height: 'min(580px, calc(100vh - 100px))',
        zIndex: 1100,
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 16px 40px -8px rgba(5, 27, 17, 0.3), 0 0 0 1px rgba(5, 27, 17, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      {/* Widget Header */}
      <div style={{
        backgroundColor: 'var(--primary-950)',
        color: '#ffffff',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <Bot size={18} color="#86efac" />
            <span style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              border: '1.5px solid var(--primary-950)'
            }} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              AgriFlow Copilot
            </div>
            <div style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: 600 }}>
              Background Voice & Navigator
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as VoiceLanguage);
              resetLivenessTimers();
            }}
            style={{
              padding: '3px 6px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            <option value="en" style={{ color: '#000000' }}>EN (English)</option>
            <option value="pcm" style={{ color: '#000000' }}>PCM (Pidgin)</option>
          </select>

          {/* Voice Output Mute/Unmute */}
          <button
            type="button"
            onClick={() => {
              setIsSpeechEnabled(!isSpeechEnabled);
              if (isSpeechEnabled && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            }}
            style={{
              padding: '5px',
              borderRadius: '6px',
              backgroundColor: isSpeechEnabled ? 'rgba(52, 211, 153, 0.2)' : 'transparent',
              border: 'none',
              color: isSpeechEnabled ? '#86efac' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isSpeechEnabled ? "Voice output enabled (click to mute)" : "Voice output muted (click to enable)"}
          >
            {isSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Reset chat */}
          <button
            type="button"
            onClick={handleResetChat}
            style={{
              padding: '5px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Clear Chat"
          >
            <RotateCcw size={15} />
          </button>

          {/* Minimize */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            style={{
              padding: '5px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Minimize"
          >
            <Minus size={16} />
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '5px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Close Assistant"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips (NO Admin Button!) */}
      <div style={{
        padding: '8px 12px',
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none'
      }}>
        {[
          { label: '🌾 Supplier Portal', cmd: 'Open supplier dashboard' },
          { label: '🛠️ Service Hub', cmd: 'Open service hub' },
          { label: '🚜 Find Tractor Operator', cmd: 'Find a tractor operator in services' },
          { label: '📡 Check Buyer RFQs', cmd: 'Show demand radar' },
          { label: '🛒 Shop Produce', cmd: 'Open marketplace' },
        ].map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(chip.cmd)}
            style={{
              padding: '4px 9px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--primary-900)',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Inactivity Liveness Banner */}
      {showLivenessPrompt && (
        <div style={{
          backgroundColor: '#fef3c7',
          borderBottom: '1px solid #fde68a',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#92400e',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={15} color="#b45309" />
            <span><strong>Are you still available?</strong> (Stopping in {livenessSecondsLeft}s)</span>
          </div>
          <button
            type="button"
            onClick={() => {
              resetLivenessTimers();
              speakText("I am listening! What would you like to explore?");
            }}
            style={{
              backgroundColor: '#b45309',
              color: '#ffffff',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            Yes, I'm here
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#ffffff'
      }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '90%',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                padding: '10px 14px',
                borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                backgroundColor: isUser ? 'var(--primary-800)' : 'var(--bg-subtle)',
                color: isUser ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.86rem',
                lineHeight: 1.45,
                boxShadow: isUser ? 'var(--shadow-sm)' : 'none',
                border: isUser ? 'none' : '1px solid var(--border-subtle)'
              }}>
                {msg.text}
              </div>

              {/* Action Executed Badge */}
              {msg.actionExecuted && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: msg.actionExecuted.includes('restricted') ? '#fee2e2' : '#dcfce7',
                  color: msg.actionExecuted.includes('restricted') ? '#991b1b' : '#15803d',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  marginTop: '4px'
                }}>
                  <CheckCircle2 size={12} />
                  <span>{msg.actionExecuted}</span>
                </div>
              )}

              <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)', marginTop: '2px', padding: '0 4px' }}>
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isThinking && (
          <div style={{
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '16px 16px 16px 2px',
            backgroundColor: 'var(--bg-subtle)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <Sparkles size={14} className="animate-spin" color="var(--primary-600)" />
            <span>Executing in background...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{
          padding: '10px 14px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <button
          type="button"
          onClick={handleToggleMic}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: isListening ? '#ef4444' : 'var(--bg-subtle)',
            border: isListening ? 'none' : '1px solid var(--border-color)',
            color: isListening ? '#ffffff' : 'var(--primary-900)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s ease'
          }}
          title={isListening ? "Listening... Click to stop" : "Speak your request"}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <input
          type="text"
          placeholder={language === 'pcm' ? "Type command or wetin you need..." : "Ask questions or say 'open supplier portal'..."}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            resetLivenessTimers();
          }}
          style={{
            flex: 1,
            padding: '9px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            outline: 'none',
            backgroundColor: 'var(--bg-page)'
          }}
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: inputText.trim() ? 'var(--primary-700)' : 'var(--bg-subtle)',
            color: inputText.trim() ? '#ffffff' : 'var(--text-faint)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'default',
            flexShrink: 0
          }}
        >
          <Send size={15} />
        </button>
      </form>
    </aside>
  );
};
