import React from 'react';
import { FormulaSection as FormulaSectionType } from '../../config/types';

interface FormulaSectionProps {
  section: FormulaSectionType;
  language: string;
}

export const FormulaSection: React.FC<FormulaSectionProps> = ({ section, language }) => {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[language] || obj.ru || obj.en || Object.values(obj)[0] || '';
  };

  return (
    <div className="formula-section" style={{ 
      marginBottom: '1.5rem',
      padding: '1rem',
      background: '#f8f9fa',
      borderRadius: '8px',
      borderLeft: '4px solid #3498db'
    }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#2c3e50' }}>
        {getText(section.title)}
      </h3>
      
      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
        {getText(section.content)}
      </p>
      
      <pre style={{ 
        background: '#fff',
        padding: '0.75rem',
        borderRadius: '4px',
        overflow: 'auto',
        border: '1px solid #e0e0e0',
        marginBottom: '1rem'
      }}>
        <code style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
          {section.latex_formula}
        </code>
      </pre>
      
      <div style={{ 
        padding: '0.75rem',
        background: '#fff3e0',
        borderRadius: '4px',
        borderLeft: '3px solid #ff9800'
      }}>
        <strong style={{ color: '#e65100' }}>Пример:</strong>{' '}
        <span>{getText(section.example)}</span>
      </div>
    </div>
  );
};