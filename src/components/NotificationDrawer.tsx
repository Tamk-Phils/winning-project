import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Sparkles, 
  MessageSquare, 
  Radio, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import type { AppNotification, AppView } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (view: AppView) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIconForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'match_alert':
        return <Sparkles size={16} color="var(--primary-600)" />;
      case 'chat_message':
        return <MessageSquare size={16} color="#0284c7" />;
      case 'order_update':
        return <Radio size={16} color="#d97706" />;
      case 'privacy_notice':
        return <ShieldCheck size={16} color="#16a34a" />;
      default:
        return <Bell size={16} color="var(--primary-700)" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    onMarkAsRead(notif.id);
    if (notif.targetView) {
      onNavigate(notif.targetView);
      onClose();
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 27, 17, 0.65)',
      backdropFilter: 'blur(4px)',
      zIndex: 1200,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div 
        className="drawer-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--primary-800)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                backgroundColor: 'var(--earth-500)',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {unreadCount} new
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--primary-700)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Bell size={32} color="var(--text-faint)" style={{ margin: '0 auto 10px' }} />
              <p style={{ margin: 0, fontSize: '0.88rem' }}>You have no notifications right now.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: notif.isRead ? 'var(--bg-subtle)' : '#ffffff',
                  border: notif.isRead ? '1px solid var(--border-subtle)' : '1px solid var(--primary-200)',
                  boxShadow: notif.isRead ? 'none' : '0 2px 8px rgba(15, 70, 44, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  transition: 'all var(--trans-fast)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: notif.isRead ? '#f1f5f9' : 'var(--primary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getIconForType(notif.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: notif.isRead ? 600 : 800, 
                      color: 'var(--primary-950)' 
                    }}>
                      {notif.title}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                      {notif.timestamp}
                    </span>
                  </div>

                  <p style={{ 
                    fontSize: '0.8rem', 
                    color: 'var(--text-muted)', 
                    lineHeight: 1.4, 
                    margin: 0, 
                    marginBottom: notif.actionLabel ? '8px' : 0 
                  }}>
                    {notif.message}
                  </p>

                  {notif.actionLabel && (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--primary-700)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{notif.actionLabel}</span>
                      <ArrowRight size={12} />
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
