import { useTranslation } from 'react-i18next';
import s from './ResultSection.module.scss';
import { typography } from '$/shared/typography/typography';

interface ResultSectionProps {
  equity: number | null;
}

export const ResultSection = ({ equity }: ResultSectionProps) => {
  const { t } = useTranslation();

  if (equity === null) return null;

  const result = equity * 100;

  return (
    <div className={s.root}>
      <h3 className={typography({ variant: 'headingSm' })}>{t('calculator.result')}</h3>
      <div className={s.result}>
        <div className={s.equityValue}>{result.toFixed(2)}%</div>
        <div className={s.bar}>
          <div className={s.progressBar} style={{ width: `${result}%` }} />
        </div>
      </div>
    </div>
  );
};
