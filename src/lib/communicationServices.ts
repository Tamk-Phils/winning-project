import type { 
  AppNotification, 
  EmailLog, 
  SmsLog, 
  DisputeReport 
} from '../types';
import { 
  INITIAL_NOTIFICATIONS, 
  INITIAL_EMAIL_LOGS, 
  INITIAL_SMS_LOGS, 
  INITIAL_DISPUTES 
} from '../data/mockData';
import { getSupabase } from './supabase';

const STORAGE_KEY_NOTIFICATIONS = 'agriflow_notifications_v1';
const STORAGE_KEY_EMAIL_LOGS = 'agriflow_email_logs_v1';
const STORAGE_KEY_SMS_LOGS = 'agriflow_sms_logs_v1';
const STORAGE_KEY_DISPUTES = 'agriflow_disputes_v1';

// -------------------------------------------------------------
// IN-APP NOTIFICATIONS SERVICE
// -------------------------------------------------------------

export async function fetchNotifications(): Promise<AppNotification[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('notifications')
        .select('*')
        .order('timestamp', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as AppNotification[];
      }
    } catch (e) {
      console.warn('Supabase fetchNotifications fallback to local', e);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (!raw) return INITIAL_NOTIFICATIONS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

export async function addNotification(notification: AppNotification): Promise<void> {
  const current = await fetchNotifications();
  const updated = [notification, ...current];
  saveNotifications(updated);

  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from('notifications').insert([notification]);
    } catch (e) {
      console.warn('Supabase insert notification error', e);
    }
  }
}

export async function markNotificationAsRead(id: string): Promise<AppNotification[]> {
  const current = await fetchNotifications();
  const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
  saveNotifications(updated);
  return updated;
}

export async function markAllNotificationsAsRead(): Promise<AppNotification[]> {
  const current = await fetchNotifications();
  const updated = current.map(n => ({ ...n, isRead: true }));
  saveNotifications(updated);
  return updated;
}

// -------------------------------------------------------------
// MODULAR EMAIL SERVICE (Development Preview & Safe Fallback)
// -------------------------------------------------------------

export interface EmailSendRequest {
  toEmail: string;
  recipientName: string;
  subject: string;
  template: 'match_introduction' | 'buyer_inquiry' | 'order_confirmation' | 'supplier_notification';
  bodyHtml: string;
  bodyText: string;
}

export function isEmailConfigured(): boolean {
  // Check if live SMTP or API keys exist in env
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || import.meta.env.VITE_SENDGRID_API_KEY;
  const smtpHost = import.meta.env.VITE_SMTP_HOST;
  return Boolean(apiKey || smtpHost);
}

export async function fetchEmailLogs(): Promise<EmailLog[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMAIL_LOGS);
    if (!raw) return INITIAL_EMAIL_LOGS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_EMAIL_LOGS;
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
    status: configured ? 'sent' : 'simulated',
    provider: configured ? 'resend_active' : 'smtp_mock',
    errorMessage: configured 
      ? undefined 
      : 'Development Mode: No SMTP or API credentials configured in environment variables. Message safely logged in development preview.'
  };

  const currentLogs = await fetchEmailLogs();
  const updated = [log, ...currentLogs];
  try {
    localStorage.setItem(STORAGE_KEY_EMAIL_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save email log', e);
  }

  return log;
}

// -------------------------------------------------------------
// SMS SERVICE (Future-Ready Simulator)
// -------------------------------------------------------------

export function isSmsConfigured(): boolean {
  return false; // Free prototype does not require paid cellular subscriptions
}

export async function fetchSmsLogs(): Promise<SmsLog[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SMS_LOGS);
    if (!raw) return INITIAL_SMS_LOGS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_SMS_LOGS;
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
    note: 'TEST SIMULATION: Message not delivered to cellular carrier network. Live SMS requires a paid Twilio or Africa’s Talking subscription.'
  };

  const currentLogs = await fetchSmsLogs();
  const updated = [log, ...currentLogs];
  try {
    localStorage.setItem(STORAGE_KEY_SMS_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save SMS log', e);
  }

  return log;
}

// -------------------------------------------------------------
// TRUST, VERIFICATION & DISPUTE REPORTING
// -------------------------------------------------------------

export async function fetchDisputes(): Promise<DisputeReport[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISPUTES);
    if (!raw) return INITIAL_DISPUTES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_DISPUTES;
  }
}

export async function submitDispute(report: DisputeReport): Promise<void> {
  const current = await fetchDisputes();
  const updated = [report, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_DISPUTES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save dispute report', e);
  }

  // Also alert notifications
  await addNotification({
    id: `notif-disp-${Date.now()}`,
    type: 'system_alert',
    title: `Dispute Submitted: ${report.reportedEntityName}`,
    message: `Your report regarding "${report.reason.replace(/_/g, ' ')}" has been assigned to AgriFlow Moderation.`,
    timestamp: 'Just now',
    isRead: false,
    targetView: 'admin_dashboard'
  });
}
