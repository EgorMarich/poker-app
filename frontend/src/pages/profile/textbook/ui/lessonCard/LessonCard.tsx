import React from 'react';
import { useTranslation } from 'react-i18next';
import s from './LessonCard.module.scss';
import { LessonCardProps, Section } from '../../config/types';
import { ExampleHandSection } from '../exampleHandSection/ExampleHandSection';
import { TableSection } from '../tableSection/TableSection';
import { FormulaSection } from '../formulaSection/FormulaSection';
import { TextSection } from '../textSection/TextSection';
import { getLocalized } from '../../utils/GetLocalized';
import { typography } from '$/shared/typography/typography';

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const renderSection = (section: Section, index: number) => {
    switch (section.type) {
      case 'text':
        return <TextSection key={index} section={section} language={language} />;
      case 'formula':
        return <FormulaSection key={index} section={section} language={language} />;
      case 'table':
        return <TableSection key={index} section={section} language={language} />;
      case 'example_hand':
        return <ExampleHandSection key={index} section={section} language={language} />;
      default:
        return null;
    }
  };

  return (
    <article className={s.lessonCard}>
      <div className={s.info}>
        <h2 className={typography({ variant: 'bodyMd', color: 'white' })}>
          {getLocalized(lesson.title, language)}
        </h2>

        <p className={typography({ variant: 'bodySm', color: 'gray-500' })}>
          {getLocalized(lesson.short_desc, language)}
        </p>
      </div>

      <div className="sections-container">{lesson.sections.map(renderSection)}</div>
    </article>
  );
};
