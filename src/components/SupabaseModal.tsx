import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw,
  Server,
  KeyRound
} from 'lucide-react';
import type { SupabaseConfig } from '../lib/supabase';
import { 
  saveSupabaseConfig, 
  SUPABASE_SQL_SCHEMA 
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  onConfigUpdated: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
}) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState<string>(config.url || '');
  const [anonKey, setAnonKey] = useState<string>(config.anonKey || '');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'config' | 'schema'>('config');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(url, anonKey);
    onConfigUpdated();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', padding: '32px' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            backgroundColor: '#052e16', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#34d399'
          }}>
            <Database size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--primary-950)' }}>
              Supabase Agribusiness Cloud Database
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Live PostgreSQL persistence for farms, produce listings, orders, and wholesale RFQs
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div style={{ 
          margin: '16px 0 20px', 
          padding: '12px 16px', 
          borderRadius: 'var(--radius-lg)', 
          backgroundColor: config.isConnected ? 'var(--primary-50)' : '#fffbeb',
          border: `1.5px solid ${config.isConnected ? 'var(--primary-300)' : '#fde68a'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: config.isConnected ? '#10b981' : '#f59e0b',
              boxShadow: config.isConnected ? '0 0 8px #10b981' : 'none'
            }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: config.isConnected ? 'var(--primary-900)' : '#b45309' }}>
              {config.isConnected ? 'Connected to live Supabase project' : 'Live data unavailable until Supabase is configured'}
            </span>
          </div>

          <a 
            href="https://supabase.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ fontSize: '0.78rem', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
          >
            <span>Supabase Dashboard</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('config')}
            style={{ 
              padding: '10px 18px', 
              fontWeight: 700, 
              fontSize: '0.9rem', 
              borderBottom: `2.5px solid ${activeTab === 'config' ? 'var(--primary-600)' : 'transparent'}`,
              color: activeTab === 'config' ? 'var(--primary-800)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            API Credentials
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            style={{ 
              padding: '10px 18px', 
              fontWeight: 700, 
              fontSize: '0.9rem', 
              borderBottom: `2.5px solid ${activeTab === 'schema' ? 'var(--primary-600)' : 'transparent'}`,
              color: activeTab === 'schema' ? 'var(--primary-800)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            SQL Database Schema
          </button>
        </div>

        {activeTab === 'config' ? (
          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Server size={14} />
                  <span>Supabase Project URL (VITE_SUPABASE_URL)</span>
                </label>
                <input 
                  type="text" 
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="form-input"
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Found under Project Settings → API in your Supabase dashboard
                </span>
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <KeyRound size={14} />
                  <span>Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)</span>
                </label>
                <input 
                  type="password" 
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="form-input"
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Safe for client-side queries protected by Row-Level Security (RLS)
                </span>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'var(--bg-subtle)', 
              borderRadius: 'var(--radius-md)', 
              padding: '14px', 
              fontSize: '0.82rem', 
              color: 'var(--text-muted)',
              marginBottom: '24px',
              lineHeight: 1.5 
            }}>
              💡 <strong>Pro-Tip:</strong> You can also set these environment variables in your <code style={{ backgroundColor: '#ffffff', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>.env</code> file as <code style={{ backgroundColor: '#ffffff', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>VITE_SUPABASE_URL</code> and <code style={{ backgroundColor: '#ffffff', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>VITE_SUPABASE_ANON_KEY</code>.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>

              <button type="submit" className="btn btn-primary" style={{ minWidth: '160px' }}>
                {saveSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Saved & Reloaded!</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Save & Sync Client</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Copy and run this in your Supabase SQL Editor:
              </span>

              <button 
                onClick={handleCopySql} 
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                {copiedSql ? (
                  <>
                    <Check size={14} color="#059669" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy SQL Schema</span>
                  </>
                )}
              </button>
            </div>

            <pre style={{ 
              backgroundColor: '#0a1d13', 
              color: '#a7f3d0', 
              padding: '16px', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '0.78rem', 
              maxHeight: '320px', 
              overflowY: 'auto',
              fontFamily: 'monospace',
              border: '1px solid rgba(52, 211, 153, 0.2)' 
            }}>
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};
