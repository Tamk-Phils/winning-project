import React from 'react';
import { Database } from 'lucide-react';

interface DataUnavailableStateProps {
  title: string;
  message: string;
}

export const DataUnavailableState: React.FC<DataUnavailableStateProps> = ({ title, message }) => (
  <div className="container" style={{ padding: '72px 20px', textAlign: 'center' }}>
    <Database size={44} color="var(--text-faint)" style={{ margin: '0 auto 16px' }} />
    <h1 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{title}</h1>
    <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>{message}</p>
  </div>
);
