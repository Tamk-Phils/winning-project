import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Send } from 'lucide-react';
import type { DisputeReport } from '../types';
import { submitDispute } from '../lib/communicationServices';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultReportedName?: string;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  defaultReportedName = '',
}) => {
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterContact, setReporterContact] = useState<string>('');
  const [reportedEntityName, setReportedEntityName] = useState<string>(defaultReportedName);
  const [reason, setReason] = useState<DisputeReport['reason']>('unauthorized_contact');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedEntityName || !details) return;

    setIsSubmitting(true);

    const report: DisputeReport = {
      id: `disp-${Date.now()}`,
      reporterName: reporterName || 'Anonymous Verified User',
      reporterRole: 'supplier',
      reporterContact: reporterContact || 'via In-App Chat',
      reportedEntityName,
      reason,
      details,
      status: 'open_investigation',
      createdAt: new Date().toISOString()
    };

    await submitDispute(report);
    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 27, 17, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1400,
      padding: '20px'
    }}>
      <div 
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                Report an Issue or Dispute
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                AgriFlow Trust & Safety Moderation Team
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{
            padding: '24px',
            backgroundColor: '#f0fdf4',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            color: '#166534',
            fontWeight: 700
          }}>
            Dispute submitted successfully. Our compliance team will review within 24 hours.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="responsive-two-col">
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Your Name:
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Emmanuel Ndedi"
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Your Contact Phone / Email:
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="+237 6..."
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Reported Buyer / Organization:
              </label>
              <input
                type="text"
                value={reportedEntityName}
                onChange={(e) => setReportedEntityName(e.target.value)}
                placeholder="e.g. BioFresh Europe or Spot Broker"
                required
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Reason for Report:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value="unauthorized_contact">Unauthorized or Unsolicited Contact</option>
                <option value="produce_quality_mismatch">Produce Quality / Specification Mismatch</option>
                <option value="pricing_fraud">Pricing or Payment Fraud Attempt</option>
                <option value="non_delivery">Non-Delivery or Logistics Default</option>
                <option value="other">Other Suspicious Activity</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Detailed Explanation:
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Describe what occurred with timestamps and specific message context..."
                required
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem', resize: 'vertical' }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: '#fef3c7',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              color: '#92400e'
            }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>
                AgriFlow does not award verified badges to disputed users. Reports are logged in the audit ledger.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{
                  backgroundColor: '#dc2626',
                  borderColor: '#dc2626',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={14} />
                <span>{isSubmitting ? 'Submitting...' : 'File Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
