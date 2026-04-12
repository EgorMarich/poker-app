/* eslint-disable @typescript-eslint/no-explicit-any */

import clsx from 'clsx';
import s from './ResultCard.module.scss';
import { typography } from '$/shared/typography/typography';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';

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
  return (
    <div className={s.root}>
      <div className={clsx(s.badge, result.isCorrect ? s.correct : s.wrong)}>
        <span className={s.emoji}>{result.isCorrect ? '✅' : '❌'}</span>
        <span className={clsx(typography({ variant: 'bodySmSemiBold', color: 'white' }))}>
          {result.isCorrect ? 'Правильно!' : 'Неверно'}
        </span>
      </div>

      {!result.isCorrect && (
        <div className={s.correctAnswer}>
          <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
            Правильный ответ:
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
          Объяснение
        </p>
        <p className={clsx(typography({ variant: 'bodySm', color: 'white' }))}>
          {result.explanation}
        </p>
      </div>

      <PrimaryButton onClick={onNext}>{isLast ? 'Завершить' : 'Следующий вопрос →'}</PrimaryButton>
    </div>
  );
};
