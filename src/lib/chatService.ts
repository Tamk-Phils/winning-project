import { getSupabase } from './supabase';
import { addNotification } from './communicationServices';
import type { ChatMessage, Conversation } from '../types';

export async function fetchConversations(): Promise<Conversation[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb.from('conversations').select('*').order('lastMessageTimestamp', { ascending: false });
    if (error) throw error;
    return (data || []) as Conversation[];
  } catch (e) {
    console.warn('Supabase fetchConversations error', e);
    return [];
  }
}

export async function fetchChatMessages(conversationId: string): Promise<ChatMessage[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb.from('chat_messages').select('*').eq('conversationId', conversationId).order('timestamp', { ascending: true });
    if (error) throw error;
    return (data || []) as ChatMessage[];
  } catch (e) {
    console.warn('Supabase fetchChatMessages error', e);
    return [];
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

  const sb = getSupabase();
  if (!sb) throw new Error('Live chat requires a configured Supabase project.');

  const { error: messageError } = await sb.from('chat_messages').insert([newMessage]);
  if (messageError) throw messageError;

  // Update the conversation header in the same database.
  const conversations = await fetchConversations();
  await sb.from('conversations').update({ lastMessageText: messageText, lastMessageTimestamp: new Date().toISOString() }).eq('id', conversationId);

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

  const sb = getSupabase();
  if (!sb) throw new Error('Live chat requires a configured Supabase project.');
  const { error } = await sb.from('conversations').insert([newConv]);
  if (error) throw error;

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
