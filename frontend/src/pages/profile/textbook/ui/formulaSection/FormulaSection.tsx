import React from 'react';
import { FormulaSection as FormulaSectionType } from '../../config/types';
import s from './FormulaSection.module.scss';
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
    <div className={s.formulaSection}>
      <h3 className={s.title}>{getText(section.title)}</h3>
      <p className={s.text}>{getText(section.content)}</p>
      <pre className={s.pre}>
        <code style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{section.latex_formula}</code>
      </pre>

      <div
        style={{
          padding: '0.75rem',
          background: '#fff3e0',
          borderRadius: '4px',
          borderLeft: '3px solid #ff9800',
        }}
      >
        <strong style={{ color: '#e65100' }}>Пример:</strong>{' '}
        <span>{getText(section.example)}</span>
      </div>
    </div>
  );
};
