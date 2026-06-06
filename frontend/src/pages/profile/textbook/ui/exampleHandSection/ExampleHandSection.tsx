// ExampleHandSection.tsx
import React from 'react';
import { ExampleHandSection as ExampleHandType } from '../../config/types';

interface ExampleHandSectionProps {
  section: ExampleHandType;
  language: string;
}

export const ExampleHandSection: React.FC<ExampleHandSectionProps> = ({ section, language }) => {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[language] || obj.ru || obj.en || Object.values(obj)[0] || '';
  };

  return (
    <div className="example-hand-section" style={{ 
      marginBottom: '1.5rem',
      padding: '1rem',
      background: '#e8f5e9',
      borderRadius: '8px',
      borderLeft: '4px solid #4caf50'
    }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#2e7d32' }}>
        🃏 {getText(section.title)}
      </h3>
      <p style={{ lineHeight: '1.6' }}>
        {getText(section.content)}
      </p>
    </div>
  );
};