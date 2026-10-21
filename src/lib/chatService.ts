import type { Conversation, ChatMessage } from '../types';
import { INITIAL_CONVERSATIONS, INITIAL_CHAT_MESSAGES } from '../data/mockData';
import { getSupabase } from './supabase';
import { addNotification } from './communicationServices';

const STORAGE_KEY_CONVERSATIONS = 'agriflow_conversations_v1';
const STORAGE_KEY_MESSAGES_PREFIX = 'agriflow_messages_';

export async function fetchConversations(): Promise<Conversation[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('conversations')
        .select('*')
        .order('lastMessageTimestamp', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Conversation[];
      }
    } catch (e) {
      console.warn('Supabase fetchConversations fallback to local', e);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
    if (!raw) return INITIAL_CONVERSATIONS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONVERSATIONS;
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save conversations', e);
  }
}

export async function fetchChatMessages(conversationId: string): Promise<ChatMessage[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('chat_messages')
        .select('*')
        .eq('conversationId', conversationId)
        .order('timestamp', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as ChatMessage[];
      }
    } catch (e) {
      console.warn('Supabase fetchChatMessages fallback to local', e);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES_PREFIX + conversationId);
    if (!raw) {
      return INITIAL_CHAT_MESSAGES[conversationId] || [];
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CHAT_MESSAGES[conversationId] || [];
  }
}

export function saveChatMessages(conversationId: string, messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MESSAGES_PREFIX + conversationId, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save messages', e);
  }
}

export async function sendChatMessage(
  conversationId: string,
  senderId: string,
  senderRole: 'buyer' | 'supplier',
  senderName: string,
  messageText: string,
  attachmentUrl?: string,
  attachmentType?: 'image' | 'document' | 'audio'
): Promise<ChatMessage> {
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId,
    senderRole,
    senderName,
    messageText,
    attachmentUrl,
    attachmentType,
    timestamp: `Today at ${timeString}`,
    read: true
  };

  // 1. Update message thread
  const existing = await fetchChatMessages(conversationId);
  const updated = [...existing, newMessage];
  saveChatMessages(conversationId, updated);

  // 2. Update conversation header
  const conversations = await fetchConversations();
  const updatedConversations = conversations.map(c => {
    if (c.id === conversationId) {
      return {
        ...c,
        lastMessageText: messageText,
        lastMessageTimestamp: 'Just now'
      };
    }
    return c;
  });
  saveConversations(updatedConversations);

  // 3. Trigger In-App Notification for recipient
  const targetConv = conversations.find(c => c.id === conversationId);
  if (targetConv) {
    const recipientName = senderRole === 'supplier' ? targetConv.buyerName : targetConv.supplierName;
    await addNotification({
      id: `notif-chat-${Date.now()}`,
      type: 'chat_message',
      title: `New Message for ${recipientName}`,
      message: `${senderName}: ${messageText.length > 80 ? messageText.substring(0, 80) + '...' : messageText}`,
      timestamp: 'Just now',
      isRead: false,
      targetView: 'live_chat',
      targetId: conversationId,
      actionLabel: 'Reply in Chat'
    });
  }

  // 4. Supabase sync if connected
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from('chat_messages').insert([newMessage]);
    } catch (e) {
      console.warn('Supabase chat sync error', e);
    }
  }

  return newMessage;
}

export async function createConversation(
  buyerId: string,
  buyerName: string,
  supplierId: string,
  supplierName: string,
  subject: string,
  firstMessageText: string,
  relatedOpportunityId?: string,
  relatedProductId?: string
): Promise<Conversation> {
  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    buyerId,
    buyerName,
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    buyerLocation: 'Verified Commercial Buyer',
    supplierId,
    supplierName,
    supplierAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80',
    relatedOpportunityId,
    relatedProductId,
    subject,
    lastMessageText: firstMessageText,
    lastMessageTimestamp: 'Just now',
    unreadCountSupplier: 1,
    unreadCountBuyer: 0,
    status: 'active'
  };

  const conversations = await fetchConversations();
  saveConversations([newConv, ...conversations]);

  // Add initial message
  await sendChatMessage(
    newConv.id,
    buyerId,
    'buyer',
    buyerName,
    firstMessageText
  );

  return newConv;
}
