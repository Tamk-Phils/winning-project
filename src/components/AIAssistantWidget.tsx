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
  Bot
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
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(false); // Audio off by default so no unwanted robotic voice
  const [isListening, setIsListening] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello! I am your AgriFlow AI Copilot. Ask me questions about crops, market prices, or tell me to 'open admin panel', 'book a tractor in services', or 'find buyer demands' and I will execute it directly.",
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

  // Speech Synthesis helper (only if enabled by user)
  const speakText = (text: string) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = language === 'pcm' ? 'en-NG' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const executeAction = (action?: AssistantAction): string | undefined => {
    if (!action) return undefined;

    if (action.type === 'navigate' && action.target) {
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
      if (isSpeechEnabled) {
        speakText(response.message);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: "I am ready to assist. You can ask me to open any page (Admin, Services, Marketplace, Logistics) or inspect harvest prices.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionExecuted: executedLabel
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  // Speech Recognition toggle
  const handleToggleMic = () => {
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
          onClick={() => setIsMinimized(false)}
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
              backgroundColor: '#34d399',
              border: '2px solid var(--primary-950)'
            }} />
          </div>

          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              AgriFlow Copilot
            </div>
            <div style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: 600 }}>
              Background LLM Active
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLanguage(l => l === 'en' ? 'pcm' : 'en')}
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            title="Toggle between English and Cameroonian Pidgin"
          >
            {language === 'en' ? 'EN' : 'PIDGIN'}
          </button>

          {/* Voice Audio Read-Aloud Toggle */}
          <button
            type="button"
            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
            style={{
              padding: '5px',
              borderRadius: '6px',
              backgroundColor: isSpeechEnabled ? 'var(--primary-700)' : 'transparent',
              border: 'none',
              color: isSpeechEnabled ? '#86efac' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isSpeechEnabled ? "Voice audio read-aloud: ON" : "Voice audio read-aloud: OFF"}
          >
            {isSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Reset Chat */}
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
            title="Clear Chat History"
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

      {/* Suggested Quick Prompt Chips */}
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
          { label: '🛡️ Open Admin Panel', cmd: 'Open admin panel' },
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
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
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
            <span>Thinking & executing...</span>
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
          placeholder={language === 'pcm' ? "Type command or wetin you need..." : "Ask questions or type 'open admin'..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
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
