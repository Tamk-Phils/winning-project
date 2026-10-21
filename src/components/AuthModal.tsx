import React, { useState } from 'react';
import { LogIn, UserPlus, X } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated }) => {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setMessage('Connect Supabase before creating or accessing an account.');
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    const result = mode === 'sign-in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setIsSubmitting(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    setMessage(mode === 'sign-up' ? 'Account created. Check your email if confirmation is enabled.' : 'Signed in successfully.');
    onAuthenticated();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(20, 24, 20, 0.62)' }}>
      <div onClick={(event) => event.stopPropagation()} style={{ width: '100%', maxWidth: 420, padding: 28, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 6, boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div>
            <span className="eyebrow" style={{ marginBottom: 6 }}>AgriFlow account</span>
            <h2 style={{ margin: 0, fontSize: '1.7rem' }}>{mode === 'sign-in' ? 'Welcome back' : 'Create supplier access'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close authentication"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <label className="form-label">Email<input className="form-input" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label className="form-label">Password<input className="form-input" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {message && <p role="status" style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{message}</p>}
          <button className="lime-button" disabled={isSubmitting} type="submit">
            {mode === 'sign-in' ? <LogIn size={16} /> : <UserPlus size={16} />}
            {isSubmitting ? 'Working...' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button type="button" className="text-button" style={{ marginTop: 18 }} onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>
          {mode === 'sign-in' ? 'Need a supplier account?' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};
