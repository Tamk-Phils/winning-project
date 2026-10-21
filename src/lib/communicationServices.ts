import type { AppNotification, EmailLog, SmsLog, DisputeReport } from '../types';
import { getSupabase } from './supabase';

export function subscribeToNotifications(userId: string, onNotification: (notification: AppNotification) => void): () => void {
  const sb = getSupabase();
  if (!sb) return () => undefined;
  const channel = sb
    .channel(`notifications:${userId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `userId=eq.${userId}` }, (payload) => onNotification(payload.new as AppNotification))
    .subscribe();
  return () => { void sb.removeChannel(channel); };
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb.from('notifications').select('*').order('timestamp', { ascending: false });
    if (error) throw error;
    return (data || []) as AppNotification[];
  } catch (error) {
    console.warn('Supabase fetchNotifications error', error);
    return [];
  }
}

export async function addNotification(notification: AppNotification): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error('Notifications require a configured Supabase project.');
  const { error } = await sb.from('notifications').insert([notification]);
  if (error) throw error;
}

export async function markNotificationAsRead(id: string): Promise<AppNotification[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { error } = await sb.from('notifications').update({ isRead: true }).eq('id', id);
  if (error) throw error;
  return fetchNotifications();
}

export async function markAllNotificationsAsRead(): Promise<AppNotification[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { error } = await sb.from('notifications').update({ isRead: true }).eq('isRead', false);
  if (error) throw error;
  return fetchNotifications();
}

export interface EmailSendRequest {
  toEmail: string;
  recipientName: string;
  subject: string;
  template: 'match_introduction' | 'buyer_inquiry' | 'order_confirmation' | 'supplier_notification';
  bodyHtml: string;
  bodyText: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(import.meta.env.VITE_RESEND_API_KEY || import.meta.env.VITE_SENDGRID_API_KEY || import.meta.env.VITE_SMTP_HOST);
}

export async function fetchEmailLogs(): Promise<EmailLog[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb.from('email_logs').select('*').order('timestamp', { ascending: false });
    if (error) throw error;
    return (data || []) as EmailLog[];
  } catch (error) {
    console.warn('Supabase fetchEmailLogs error', error);
    return [];
  }
}

export async function sendEmail(req: EmailSendRequest): Promise<EmailLog> {
  const configured = isEmailConfigured();
  const log: EmailLog = {
    id: `email-${Date.now()}`,
    toEmail: req.toEmail,
    recipientName: req.recipientName,
    subject: req.subject,
    template: req.template,
    bodyHtml: req.bodyHtml,
    bodyText: req.bodyText,
    timestamp: new Date().toISOString(),
    status: configured ? 'queued' : 'simulated',
    provider: configured ? 'resend_active' : 'smtp_mock',
    errorMessage: configured ? undefined : 'No email provider configured; this preview was not delivered.'
  };
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from('email_logs').insert([log]);
    if (error) throw error;
  }
  return log;
}

export function isSmsConfigured(): boolean {
  return false;
}

export async function fetchSmsLogs(): Promise<SmsLog[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb.from('sms_logs').select('*').order('timestamp', { ascending: false });
    if (error) throw error;
    return (data || []) as SmsLog[];
  } catch (error) {
    console.warn('Supabase fetchSmsLogs error', error);
    return [];
  }
}

export async function sendSimulatedSms(toPhone: string, messageText: string): Promise<SmsLog> {
  const log: SmsLog = {
    id: `sms-${Date.now()}`,
    toPhone,
    messageText,
    status: 'simulated_test',
    provider: 'simulator',
    timestamp: new Date().toISOString(),
    note: 'TEST SIMULATION: Message was not delivered to a cellular network.'
  };
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from('sms_logs').insert([log]);
    if (error) throw error;
  }
  return log;
}

export async function fetchDisputes(): Promise<DisputeReport[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb.from('disputes').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as DisputeReport[];
  } catch (error) {
    console.warn('Supabase fetchDisputes error', error);
    return [];
  }
}

export async function submitDispute(report: DisputeReport): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error('Dispute reporting requires a configured Supabase project.');
  const { error } = await sb.from('disputes').insert([{ ...report, created_at: report.createdAt }]);
  if (error) throw error;
  await addNotification({
    id: `notif-disp-${Date.now()}`,
    type: 'system_alert',
    title: `Dispute Submitted: ${report.reportedEntityName}`,
    message: `Your report regarding "${report.reason.replace(/_/g, ' ')}" has been assigned to AgriFlow Moderation.`,
    timestamp: new Date().toISOString(),
    isRead: false,
    targetView: 'admin_dashboard'
  });
}
