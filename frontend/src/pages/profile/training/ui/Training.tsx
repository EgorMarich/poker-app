import { useState } from 'react';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import s from './Training.module.scss';
import { typography } from '$/shared/typography/typography';
import { useScenarios, useSubmitAttempt } from '$/entities/training/model/training.queries';
import { ResultCard } from './resultCard/ResultCard';
import { ScenarioCard } from './scenarioCard/ScenarioCard';
import { useTranslation } from 'react-i18next';

export const Training = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { data: scenarios, isLoading } = useScenarios();
  const { mutate: submitAttempt, isPending } = useSubmitAttempt();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    correctOptionId: string;
    explanation: string;
    selectedOptionId: string;
  } | null>(null);

  const [startTime] = useState(Date.now);

  const current = scenarios?.[currentIndex];
  const isLast = currentIndex === (scenarios?.length ?? 0) - 1;
  const isDone = !current && !isLoading;

  function handleAnswer(selectedOptionId: string) {
    if (!current || isPending) return;

    const timeSpentSec = Math.round((Date.now() - startTime) / 1000);

    submitAttempt(
      { scenarioId: current.id, selectedOptionId, timeSpentSec },
      {
        onSuccess: res => setResult({ ...res, selectedOptionId }),
      }
    );
  }

  function handleNext() {
    setResult(null);
    if (isLast) {
      navigate('/profile');
    } else {
      setCurrentIndex(i => i + 1);
    }
  }

  if (isLoading) {
    return (
      <div className={s.center}>
        <p className={typography({ variant: 'bodySm', color: 'gray-500' })}>
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (isDone || !current) {
    return (
      <div className={s.center}>
        <p className={clsx(s.emoji)}>🎉</p>
        <p className={clsx(typography({ variant: 'bodySmSemiBold', color: 'white' }))}>
          {t('training.done')}
        </p>
        <p className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
          { t('training.doneSubtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <div className={s.header}>
        <button className={s.back} onClick={() => navigate('/profile')}>
          ←
        </button>
        <div className={s.progress}>
          <div
            className={s.progressBar}
            style={{ width: `${((currentIndex + 1) / (scenarios?.length ?? 1)) * 100}%` }}
          />
        </div>
        <span className={clsx(s.counter, typography({ variant: 'caption', color: 'gray-500' }))}>
          {currentIndex + 1}/{scenarios?.length}
        </span>
      </div>

      {result ? (
        <ResultCard result={result} scenario={current} onNext={handleNext} isLast={isLast} />
      ) : (
        <ScenarioCard scenario={current} onAnswer={handleAnswer} isPending={isPending} />
      )}
    </div>
  );
};
