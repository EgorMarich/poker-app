/* eslint-disable @typescript-eslint/no-explicit-any */

import clsx from 'clsx';
import s from './ResultCard.module.scss';
import { typography } from '$/shared/typography/typography';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { useTranslation } from 'react-i18next';

interface Props {
  result: {
    isCorrect: boolean;
    correctOptionId: string;
    explanation: string;
    selectedOptionId: string;
  };
  scenario: any;
  onNext: () => void;
  isLast: boolean;
}

export const ResultCard = ({ result, scenario, onNext, isLast }: Props) => {
  const { t } = useTranslation();
  return (
    <div className={s.root}>
      <div className={clsx(s.badge, result.isCorrect ? s.correct : s.wrong)}>
        <span className={s.emoji}>{result.isCorrect ? '✅' : '❌'}</span>
        <span className={clsx(typography({ variant: 'bodySmSemiBold', color: 'white' }))}>
          {result.isCorrect ? t('trainig.correct') : t('training.wrong')}
        </span>
      </div>

      {!result.isCorrect && (
        <div className={s.correctAnswer}>
          <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
            {t('training.correctAnswer')}
          </span>
          <span className={clsx(typography({ variant: 'bodySmSemiBold' }))}>
            {scenario.options.find((o: any) => o.id === result.correctOptionId)?.label}
          </span>
        </div>
      )}

      <div className={s.explanation}>
        <p
          className={clsx(
            s.explanationLabel,
            typography({ variant: 'caption', color: 'gray-500' })
          )}
        >
          { t('trainig.explanation')}
        </p>
        <p className={clsx(typography({ variant: 'bodySm', color: 'white' }))}>
          {result.explanation}
        </p>
      </div>

      <PrimaryButton onClick={onNext}>
        {isLast ? t('training.finish') : t('training.next')}
      </PrimaryButton>
    </div>
  );
};
