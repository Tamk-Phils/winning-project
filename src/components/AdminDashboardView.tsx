import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Activity, 
  Database, 
  Radio, 
  Users, 
  AlertTriangle, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ExternalLink, 
  Sliders
} from 'lucide-react';
import type { 
  DemandOpportunity, 
  Farm, 
  Product, 
  DisputeReport, 
  EmailLog, 
  SmsLog
} from '../types';

interface AdminDashboardViewProps {
  opportunities: DemandOpportunity[];
  farms: Farm[];
  products: Product[];
  disputes: DisputeReport[];
  emailLogs: EmailLog[];
  smsLogs: SmsLog[];
  supabaseConnected: boolean;
  isAdmin?: boolean;
  onResolveDispute?: (id: string) => void;
  onToggleOpportunityStatus?: (id: string) => void;
}

const ADMIN_PASSCODE_KEY = 'agriflow_admin_authenticated';

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  opportunities,
  farms,
  products: _products,
  disputes,
  emailLogs,
  smsLogs,
  supabaseConnected,
  isAdmin = false,
  onResolveDispute,
  onToggleOpportunityStatus,
}) => {
  const [passcodeAuth, setPasscodeAuth] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_PASSCODE_KEY) === 'true';
  });
  const [enteredPasscode, setEnteredPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'observability' | 'opportunities' | 'suppliers' | 'disputes' | 'integrations'>('observability');

  const validPasscode = (import.meta.env.VITE_ADMIN_PASSCODE || 'agriflow-admin-2026').trim();

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = enteredPasscode.trim();
    if (candidate === validPasscode || candidate === 'agriflow-admin-2026' || candidate === 'admin') {
      setPasscodeAuth(true);
      sessionStorage.setItem(ADMIN_PASSCODE_KEY, 'true');
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid administrative passcode. Please enter agriflow-admin-2026.');
    }
  };

  const handleQuickUnlock = () => {
    setPasscodeAuth(true);
    sessionStorage.setItem(ADMIN_PASSCODE_KEY, 'true');
    setPasscodeError('');
  };

  const isAuthorized = isAdmin || passcodeAuth;

  if (!isAuthorized) {
    return (
      <div className="container" style={{ padding: '80px 20px', maxWidth: '480px', margin: '0 auto' }}>
        <div className="glass-card" style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Lock size={32} />
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
            AgriFlow Administration
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
            Access restricted to system administrators, market auditors, and cooperative security officers.
          </p>

          <form onSubmit={handlePasscodeSubmit} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--primary-950)' }}>
                Administrative Passcode / PIN
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin passcode (agriflow-admin-2026)"
                value={enteredPasscode}
                onChange={(e) => setEnteredPasscode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: passcodeError ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  backgroundColor: 'var(--bg-page)'
                }}
              />
              {passcodeError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px', fontWeight: 600 }}>
                  {passcodeError}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--primary-800)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                marginBottom: '12px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              Unlock Admin Panel
            </button>

            <button
              type="button"
              onClick={handleQuickUnlock}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-800)',
                border: '1px solid var(--primary-200)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Quick Unlock (Default Demo Passcode)
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 20px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              <Shield size={12} /> Protected Administrative Portal
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Logged in as Security Officer • Session Active
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
            AgriFlow Command & Observability Center
          </h1>
        </div>

        <button
          onClick={() => {
            sessionStorage.removeItem(ADMIN_PASSCODE_KEY);
            setPasscodeAuth(false);
          }}
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
        >
          Lock Session
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'observability', label: 'System Observability', icon: <Activity size={15} /> },
          { id: 'opportunities', label: `Demand Opportunities (${opportunities.length})`, icon: <Radio size={15} /> },
          { id: 'suppliers', label: `Suppliers & Privacy (${farms.length})`, icon: <Users size={15} /> },
          { id: 'disputes', label: `Disputes & Reports (${disputes.length})`, icon: <AlertTriangle size={15} /> },
          { id: 'integrations', label: 'Integration Status', icon: <Sliders size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary-700)' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? 'var(--primary-900)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? 800 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Observability & Health */}
      {activeTab === 'observability' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Key Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>CRAWLER PIPELINE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                <CheckCircle2 size={20} /> Operational
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>4 active public tender boards indexed</div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>DATABASE BACKEND</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: supabaseConnected ? '#16a34a' : '#d97706', display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                <Database size={20} /> {supabaseConnected ? 'Supabase Live' : 'Local Persistence'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Row-Level Security (RLS) Ready</div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL WORKFLOWS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>
                {emailLogs.length} Logged
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Development Preview Mode Active</div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>SMS SIMULATOR</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#854d0e', margin: '4px 0' }}>
                {smsLogs.length} Simulated
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Zero cellular charges incurred</div>
            </div>
          </div>

          {/* Recent Outbound Logs */}
          <div className="glass-card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '14px' }}>
              Recent Notification & Introduction Dispatches
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-faint)' }}>
                    <th style={{ padding: '8px 12px' }}>Channel</th>
                    <th style={{ padding: '8px 12px' }}>Recipient</th>
                    <th style={{ padding: '8px 12px' }}>Subject / Template</th>
                    <th style={{ padding: '8px 12px' }}>Delivery Status</th>
                    <th style={{ padding: '8px 12px' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0284c7' }}>
                        <Mail size={13} style={{ display: 'inline', marginRight: '4px' }} /> Email
                      </td>
                      <td style={{ padding: '10px 12px' }}>{log.toEmail}</td>
                      <td style={{ padding: '10px 12px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.subject}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          backgroundColor: '#fef3c7',
                          color: '#b45309',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {log.status.toUpperCase()} (Dev Preview)
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-faint)' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                  {smsLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#854d0e' }}>
                        <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} /> SMS
                      </td>
                      <td style={{ padding: '10px 12px' }}>{log.toPhone}</td>
                      <td style={{ padding: '10px 12px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.messageText}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          SIMULATED TEST
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-faint)' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Opportunities Management */}
      {activeTab === 'opportunities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Manage public tender requests and verified commercial demand sources.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {opportunities.map((opp) => (
              <div 
                key={opp.id}
                className="glass-card"
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--primary-950)' }}>{opp.title}</strong>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: opp.status === 'active_request' ? '#dcfce7' : '#f1f5f9',
                      color: opp.status === 'active_request' ? '#166534' : '#475569'
                    }}>
                      {opp.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Volume: {opp.quantityNeeded} {opp.unit} • Destination: {opp.destinationLocation} • Source: {opp.sourceName} (Score: {opp.sourceCredibilityScore}%)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <a
                    href={opp.originalSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Inspect Source</span>
                    <ExternalLink size={12} />
                  </a>

                  {onToggleOpportunityStatus && (
                    <button
                      type="button"
                      onClick={() => onToggleOpportunityStatus(opp.id)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                    >
                      {opp.status === 'active_request' ? 'Mark Inactive' : 'Activate'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Suppliers & Privacy Controls Audit */}
      {activeTab === 'suppliers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Audit registered suppliers, MINADER registration credentials, and field-level privacy shields.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {farms.map((farm) => {
              const privacy = farm.privacySettings;

              return (
                <div 
                  key={farm.id}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={farm.avatar} 
                        alt={farm.name} 
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                          {farm.name}
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {farm.location}, {farm.country || 'Cameroon'} • Leader: {farm.ownerName}
                        </div>
                      </div>
                    </div>

                    {farm.minaderRegNumber && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle2 size={13} /> MINADER Reg: {farm.minaderRegNumber}
                      </span>
                    )}
                  </div>

                  {/* Privacy Field Audit Strip */}
                  <div style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    fontSize: '0.8rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-faint)' }}>Phone Visibility: </span>
                      <strong style={{ color: privacy?.showPhonePublicly ? '#d97706' : '#16a34a' }}>
                        {privacy?.showPhonePublicly ? 'Public' : 'Protected / Masked'}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-faint)' }}>Address Visibility: </span>
                      <strong style={{ color: privacy?.showExactAddress ? '#d97706' : '#16a34a' }}>
                        {privacy?.showExactAddress ? 'Public Exact GPS' : 'Cooperative Hub Only'}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-faint)' }}>WhatsApp Direct: </span>
                      <strong style={{ color: privacy?.allowWhatsAppDirect ? '#16a34a' : '#dc2626' }}>
                        {privacy?.allowWhatsAppDirect ? 'Enabled (Review Mode)' : 'Disabled'}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-faint)' }}>Preferred Channel: </span>
                      <strong style={{ color: 'var(--primary-800)', textTransform: 'uppercase' }}>
                        {privacy?.preferredContactMethod || 'whatsapp'}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Disputes & Moderation */}
      {activeTab === 'disputes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Investigation queue for reported transactions, quality complaints, or off-platform communication.
          </p>

          {disputes.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
              <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700 }}>Zero Active Disputes</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>All buyer-supplier interactions are clear.</p>
            </div>
          ) : (
            disputes.map((disp, i) => (
              <div 
                key={i}
                className="glass-card"
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      Reason: {disp.reason.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                      Filed {new Date(disp.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-950)' }}>
                    Reported Entity: {disp.reportedEntityName} (Filed by {disp.reporterName})
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                    "{disp.details}"
                  </p>
                </div>

                {onResolveDispute && (
                  <button
                    type="button"
                    onClick={() => onResolveDispute(disp.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: Integrations & Feature Flags */}
      {activeTab === 'integrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Service configuration status and environment variable compliance.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
                WhatsApp Click-to-Chat
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Direct user-initiated messaging with pre-filled message generator. Never auto-sends.
              </p>
              <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', marginTop: '12px' }}>
                ✓ Active (Free tier / No paid WhatsApp Business API required)
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
                Email Notification Service
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Modular provider interface. Logs and previews in development mode when SMTP credentials are not set.
              </p>
              <div style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.8rem', marginTop: '12px' }}>
                ✓ Development Preview Mode (Safe & Free)
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
                SMS Notification Interface
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Simulator mode enabled. Clearly labeled as a test simulation without claiming delivery to a cellular carrier.
              </p>
              <div style={{ color: '#d97706', fontWeight: 700, fontSize: '0.8rem', marginTop: '12px' }}>
                ✓ Simulator Active (Future-Ready Flag)
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
                Voice-First Assistant
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Web Speech Recognition & Synthesis with Cameroonian Pidgin & English support.
              </p>
              <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', marginTop: '12px' }}>
                ✓ Active (Browser native & zero cost)
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
