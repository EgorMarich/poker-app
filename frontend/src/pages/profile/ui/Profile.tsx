import { useSubscription } from '$/entities/payments/model/payments.queries';
import { useProfile } from '$/entities/user/model/auth.queries';
import { useTrainingStats } from '$/entities/training/model/training.queries';
import { Account } from './account/Account';
import { TrainingStats } from './trainingStats/TrainingStats';
import s from './Profile.module.scss';
import { Subscribe } from './subscribe/Subscribe';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { typography } from '$/shared/typography/typography';
import { clsx } from 'clsx';

export const Profile = () => {
  const { data: user } = useProfile();
  const { data: subscription } = useSubscription();
  const { data: stats } = useTrainingStats();

  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className={s.root}>
      <Account
        avatar={user?.telegramPhotoUrl ?? undefined}
        name={user?.firstName ?? t('profile.title')}
        subscription={subscription}
      />
      <div className={s.textbook}>
        <p className={typography({ variant: 'bodySmSemiBold', color: 'white' })}>
          {t('profile.textbook')}
        </p>
        <p className={clsx(s.text, typography({ variant: 'caption', color: 'gray-500' }))}>
          {t('profile.textbookDesc')}
        </p>
        <PrimaryButton onClick={() => navigate('/textbook')}>
          {t('profile.toTextbook')}
        </PrimaryButton>
      </div>
      <TrainingStats stats={stats} />
      <Subscribe subscription={subscription} />

      {user?.role === 'admin' && (
        <PrimaryButton onClick={() => navigate('/admin')}>Перейти в админку</PrimaryButton>
      )}
    </div>
  );
};
