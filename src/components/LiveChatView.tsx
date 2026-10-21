import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Search, 
  Paperclip, 
  Mic, 
  AlertTriangle, 
  CheckCheck, 
  FileText, 
  Image as ImageIcon,
  ShieldCheck
} from 'lucide-react';
import type { Conversation, ChatMessage } from '../types';
import { fetchConversations, fetchChatMessages, sendChatMessage, subscribeToConversation } from '../lib/chatService';

interface LiveChatViewProps {
  initialConversationId?: string;
  onOpenDisputeModal?: (reportedName: string) => void;
  currentUser: { id: string; name: string; role: 'buyer' | 'supplier' } | null;
}

export const LiveChatView: React.FC<LiveChatViewProps> = ({
  initialConversationId,
  onOpenDisputeModal,
  currentUser,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState<boolean>(false);
  const [safetyNoticeDismissed, setSafetyNoticeDismissed] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    async function loadConvs() {
      const convs = await fetchConversations();
      setConversations(convs);

      if (convs.length > 0) {
        const targetId = (initialConversationId && convs.some(c => c.id === initialConversationId))
          ? initialConversationId
          : convs[0].id;
        setActiveConversationId(targetId);
      }
    }
    loadConvs();
  }, [initialConversationId]);

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (!activeConversationId) return;

    async function loadMsgs() {
      const msgs = await fetchChatMessages(activeConversationId);
      setMessages(msgs);
    }
    loadMsgs();
    return subscribeToConversation(
      activeConversationId,
      (message) => setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]),
      (conversation) => setConversations((current) => current.map((item) => item.id === conversation.id ? { ...item, ...conversation } : item))
    );
  }, [activeConversationId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  if (!currentUser) {
    return <div className="container" style={{ padding: '72px 20px', textAlign: 'center' }}><h1>Sign in to use Live Chat</h1><p style={{ color: 'var(--text-muted)' }}>Private conversations are available only to authenticated participants.</p></div>;
  }

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    const textToSend = inputText.trim();
    setInputText('');

    const newMsg = await sendChatMessage(
      activeConversationId,
      currentUser.id,
      currentUser.role,
      currentUser.name,
      textToSend
    );

    setMessages(prev => [...prev, newMsg]);

    // Update conversation preview in sidebar
    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          lastMessageText: textToSend,
          lastMessageTimestamp: 'Just now'
        };
      }
      return c;
    }));
  };

  // Simulate sending sample attachment
  const handleSendAttachment = async (type: 'image' | 'document') => {
    if (!activeConversationId) return;
    setShowAttachmentMenu(false);

    const attachmentUrl = type === 'image'
      ? 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
      : 'https://example.com/phytosanitary_cert_cmr_2026.pdf';

    const text = type === 'image'
      ? 'Attached photograph of current harvest warehouse lot ready for palletizing.'
      : 'Attached certified phytosanitary clearance certificate from Douala Phytosanitary Inspection Station.';

    const newMsg = await sendChatMessage(
      activeConversationId,
      currentUser.id,
      currentUser.role,
      currentUser.name,
      text,
      attachmentUrl,
      type
    );

    setMessages(prev => [...prev, newMsg]);
  };

  // Simulate voice note recording
  const handleToggleVoiceNote = async () => {
    if (isRecordingAudio) {
      setIsRecordingAudio(false);
      // Send simulated audio note
      const newMsg = await sendChatMessage(
        activeConversationId,
        currentUser.id,
        currentUser.role,
        currentUser.name,
        '🎙️ Voice Note (0:18) — "Greetings, confirming our batch packaging specifications for your Friday inspection."',
        undefined,
        'audio'
      );
      setMessages(prev => [...prev, newMsg]);
    } else {
      setIsRecordingAudio(true);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '24px 20px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Safety Notice Banner */}
      {!safetyNoticeDismissed && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.85rem',
          color: '#166534'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#16a34a" />
            <span>
              <strong>Secure Agricultural Messaging:</strong> All communications on AgriFlow are encrypted. Never send advance payments outside formal bank Letters of Credit or escrow.
            </span>
          </div>
          <button
            onClick={() => setSafetyNoticeDismissed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534', fontWeight: 600 }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Chat Workspace Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 340px) 1fr',
        gap: '0',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        minHeight: '680px',
        maxHeight: 'calc(100vh - 180px)',
        overflow: 'hidden'
      }}>
        
        {/* Left Pane: Conversation List */}
        <div style={{
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0, marginBottom: '10px' }}>
              Messages & Inquiries
            </h2>
            
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.82rem',
                  backgroundColor: 'var(--bg-subtle)'
                }}
              />
            </div>
          </div>

          {/* List of Conversations */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConversations.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    style={{
                      padding: '14px 18px',
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      cursor: 'pointer',
                      borderLeft: isActive ? '4px solid var(--primary-600)' : '4px solid transparent',
                      transition: 'all var(--trans-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <img
                        src={conv.buyerAvatar}
                        alt={conv.buyerName}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-950)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {conv.buyerName}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                            {conv.lastMessageTimestamp}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {conv.buyerLocation}
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      fontSize: '0.78rem', 
                      color: isActive ? 'var(--text-main)' : 'var(--text-muted)', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      paddingLeft: '48px'
                    }}>
                      {conv.lastMessageText}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat Room */}
        {activeConversation ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
            
            {/* Room Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={activeConversation.buyerAvatar}
                  alt={activeConversation.buyerName}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                      {activeConversation.buyerName}
                    </h3>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      Verified Commercial Buyer
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    {activeConversation.subject}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {onOpenDisputeModal && (
                  <button
                    onClick={() => onOpenDisputeModal(activeConversation.buyerName)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #fee2e2',
                      backgroundColor: '#fff1f2',
                      color: '#b91c1c',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <AlertTriangle size={13} />
                    <span>Report / Dispute</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Thread Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: '#fbfbfa'
            }}>
              {messages.map((msg) => {
                const isSupplier = msg.senderRole === 'supplier';

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isSupplier ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: isSupplier ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      backgroundColor: isSupplier ? 'var(--primary-800)' : '#ffffff',
                      color: isSupplier ? '#ffffff' : 'var(--text-main)',
                      boxShadow: 'var(--shadow-sm)',
                      border: isSupplier ? 'none' : '1px solid var(--border-color)',
                      fontSize: '0.88rem',
                      lineHeight: 1.5
                    }}>
                      {/* Sender label */}
                      <div style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        color: isSupplier ? '#86efac' : 'var(--primary-700)',
                        marginBottom: '4px' 
                      }}>
                        {msg.senderName}
                      </div>

                      {/* Text */}
                      <div>{msg.messageText}</div>

                      {/* Attachment Preview */}
                      {msg.attachmentUrl && (
                        <div style={{ marginTop: '10px' }}>
                          {msg.attachmentType === 'image' ? (
                            <img
                              src={msg.attachmentUrl}
                              alt="Attachment"
                              style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          ) : (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              backgroundColor: isSupplier ? 'rgba(255,255,255,0.15)' : 'var(--bg-subtle)'
                            }}>
                              <FileText size={16} />
                              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Download PDF Certificate</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Timestamp & Read Receipt */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '4px',
                      fontSize: '0.72rem',
                      color: 'var(--text-faint)'
                    }}>
                      <span>{msg.timestamp}</span>
                      {isSupplier && <CheckCheck size={14} color="#16a34a" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Response Suggestions Strip */}
            <div style={{
              padding: '8px 24px',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: '#ffffff',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', alignSelf: 'center', whiteSpace: 'nowrap' }}>
                Quick Replies:
              </span>
              {[
                'We have phytosanitary EU certificates available.',
                'Can we arrange an inspection sample delivery?',
                'Our minimum export order is 1 Metric Ton.'
              ].map((text, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText(text)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Message Composer Input */}
            <form onSubmit={handleSendMessage} style={{
              padding: '14px 24px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#ffffff',
              position: 'relative'
            }}>
              
              {/* Attachment Picker */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowAttachmentMenu(prev => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                  title="Attach file"
                >
                  <Paperclip size={18} />
                </button>

                {showAttachmentMenu && (
                  <div style={{
                    position: 'absolute',
                    bottom: '48px',
                    left: 0,
                    backgroundColor: '#ffffff',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 50,
                    minWidth: '180px'
                  }}>
                    <button
                      type="button"
                      onClick={() => handleSendAttachment('document')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        fontSize: '0.8rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <FileText size={15} color="var(--primary-600)" />
                      <span>Attach Certificate (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendAttachment('image')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        fontSize: '0.8rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <ImageIcon size={15} color="var(--primary-600)" />
                      <span>Attach Produce Photo</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <input
                type="text"
                placeholder={isRecordingAudio ? 'Recording audio voice note...' : 'Type message to buyer...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isRecordingAudio}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.88rem',
                  backgroundColor: isRecordingAudio ? '#fee2e2' : '#ffffff'
                }}
              />

              {/* Voice Note Recording Simulator */}
              <button
                type="button"
                onClick={handleToggleVoiceNote}
                style={{
                  background: isRecordingAudio ? '#dc2626' : 'none',
                  border: isRecordingAudio ? 'none' : '1px solid var(--border-color)',
                  color: isRecordingAudio ? '#ffffff' : 'var(--text-muted)',
                  borderRadius: 'var(--radius-md)',
                  padding: '9px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={isRecordingAudio ? 'Click to finish and send voice note' : 'Record voice note'}
              >
                <Mic size={18} className={isRecordingAudio ? 'pulse-fast' : ''} />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="btn btn-primary"
                style={{
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.88rem',
                  fontWeight: 700
                }}
              >
                <Send size={15} />
                <span>Send</span>
              </button>
            </form>

          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a conversation on the left to start messaging.
          </div>
        )}

      </div>
    </div>
  );
};
