import React from 'react';
import { TextSection as TextSectionType } from '../../config/types';

interface TextSectionProps {
  section: TextSectionType;
  language: string;
}

export const TextSection: React.FC<TextSectionProps> = ({ section, language }) => {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[language] || obj.ru || obj.en || Object.values(obj)[0] || '';
  };

  return (
    <div className="text-section" style={{ marginBottom: '1.5rem' }}>
      {section.title && (
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#2c3e50' }}>
          {getText(section.title)}
        </h3>
      )}
      <p style={{ lineHeight: '1.6', color: '#555' }}>
        {getText(section.content)}
      </p>
    </div>
  );
};