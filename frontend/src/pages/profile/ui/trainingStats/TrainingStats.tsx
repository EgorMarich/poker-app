import clsx from 'clsx';
import s from './TrainingStats.module.scss';
import { typography } from '$/shared/typography/typography';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

interface TrainingStatsProps {
  stats?: {
    total: number;
    correct: number;
    accuracy: number;
    todayAttempts: number;
    dailyLimit: number | null;
    canAttempt: boolean;
  } | null;
}

export const TrainingStats = ({ stats }: TrainingStatsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate();
  if (!stats) return null;

  const isUnlimited = stats.dailyLimit === null;

  return (
    <div className={s.root}>
      <h4 className={clsx(s.title, typography({ variant: 'bodySmSemiBold', color: 'white' }))}>
        { t('training.stats.title')}
      </h4>

      <div className={s.grid}>
        <div className={s.card}>
          <span className={clsx(s.value, typography({ variant: 'headingSm', color: 'white' }))}>
            {stats.total}
          </span>
          <span className={clsx(s.label, typography({ variant: 'caption', color: 'gray-500' }))}>
            { t('training.stats.total')}
          </span>
        </div>

        <div className={s.card}>
          <span className={clsx(s.value, typography({ variant: 'headingSm', color: 'white' }))}>
            {stats.accuracy}%
          </span>
          <span className={clsx(s.label, typography({ variant: 'caption', color: 'gray-500' }))}>
            { t('training.stats.accuracy')}
          </span>
        </div>

        <div className={s.card}>
          <span className={clsx(s.value, typography({ variant: 'headingSm', color: 'white' }))}>
            {stats.correct}
          </span>
          <span className={clsx(s.label, typography({ variant: 'caption', color: 'gray-500' }))}>
            { t('training.stats.correct')}
          </span>
        </div>

        <div className={clsx(s.card, !stats.canAttempt && s.cardWarning)}>
          <span className={clsx(s.value, typography({ variant: 'headingSm', color: 'white' }))}>
            {isUnlimited ? '∞' : `${stats.todayAttempts}/${stats.dailyLimit}`}
          </span>
          <span className={clsx(s.label, typography({ variant: 'caption', color: 'gray-500' }))}>
            { t('training.stats.today')}
          </span>
        </div>
      </div>

      <PrimaryButton onClick={() => navigate('/training')}>{ t('training.start')}</PrimaryButton>

      {!stats.canAttempt && (
        <p className={clsx(s.limitText, typography({ variant: 'caption' }))}>
          { t('training.stats.limitExceeded')}
        </p>
      )}
    </div>
  );
};
