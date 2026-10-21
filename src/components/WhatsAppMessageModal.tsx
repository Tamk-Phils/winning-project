import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  Copy, 
  Check, 
  ShieldCheck, 
  Building2, 
  Info 
} from 'lucide-react';
import type { DemandOpportunity, Product, Farm } from '../types';
import { formatWhatsAppUrl, generateIntroductionWhatsAppMessage } from '../lib/demandRadar';
import { addNotification } from '../lib/communicationServices';

interface WhatsAppMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: DemandOpportunity | null;
  product: Product | null;
  farm: Farm | null;
}

export const WhatsAppMessageModal: React.FC<WhatsAppMessageModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  product,
  farm,
}) => {
  if (!isOpen || !opportunity || !product || !farm) return null;

  const defaultMessage = generateIntroductionWhatsAppMessage(opportunity, product, farm);
  const [messageText, setMessageText] = useState<string>(defaultMessage);
  const [copied, setCopied] = useState<boolean>(false);

  // Determine recipient phone number from opportunity
  const recipientPhone = opportunity.buyerContactInfo || '';
  const canOpenWhatsApp = Boolean(recipientPhone) && opportunity.contactPermissionStatus === 'direct_outreach_permitted';

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    if (!canOpenWhatsApp) return;
    const url = formatWhatsAppUrl(recipientPhone, messageText);
    
    // Log in-app notification for the supplier's audit trail
    addNotification({
      id: `notif-wa-${Date.now()}`,
      type: 'system_alert',
      title: `WhatsApp Contact Initiated: ${opportunity.buyerOrgName}`,
      message: `Opened pre-filled WhatsApp conversation for ${opportunity.productSought}.`,
      timestamp: 'Just now',
      isRead: false,
      targetView: 'demand_radar',
      targetId: opportunity.id
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 27, 17, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div 
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
            }}>
              <MessageCircle size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                Review WhatsApp Introduction
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Pre-formatted, verified buyer introduction ready for your review and click
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Opportunity Summary Card */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={15} color="var(--primary-700)" />
              {opportunity.buyerOrgName}
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              backgroundColor: '#dcfce7', 
              color: '#166534', 
              padding: '2px 8px', 
              borderRadius: '4px' 
            }}>
              {recipientPhone ? `Verified Contact: ${recipientPhone}` : 'No public contact supplied'}
            </span>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            <strong>Requirement:</strong> {opportunity.quantityNeeded} {opportunity.unit} of {opportunity.productSought} ({opportunity.qualityGrade})
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <strong>Destination:</strong> {opportunity.destinationLocation}, {opportunity.destinationCountry} • <strong>Source:</strong> {opportunity.sourceName}
          </div>
        </div>

        {/* Privacy & Permission Notice */}
        <div style={{
          backgroundColor: 'var(--primary-50)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          border: '1px solid var(--primary-100)',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
          fontSize: '0.82rem',
          color: 'var(--primary-900)'
        }}>
          <ShieldCheck size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Strict Consent & Privacy Guarantee:</strong> AgriFlow never sends automated WhatsApp messages without your personal review. You can customize the greeting below before opening WhatsApp.
          </div>
        </div>

        {/* Editable Message Textarea */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            Personalize Your Message:
          </label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={10}
            className="form-input"
            style={{
              width: '100%',
              fontFamily: 'monospace',
              fontSize: '0.84rem',
              lineHeight: 1.5,
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: '#fafafa',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
            <span>Character count: {messageText.length}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={12} /> Opens in WhatsApp or WhatsApp Web with text pre-filled
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>
          
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            disabled={!canOpenWhatsApp}
            className="btn btn-primary"
            style={{ 
              backgroundColor: '#25D366', 
              borderColor: '#25D366', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
            }}
          >
            <Send size={16} />
            <span>{canOpenWhatsApp ? 'Open WhatsApp & Send' : 'WhatsApp unavailable'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
