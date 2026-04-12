import { useSubscription } from '$/entities/payments/model/payments.queries';
import { useProfile } from '$/entities/user/model/auth.queries';
import { useTrainingStats } from '$/entities/training/model/training.queries';
import { Account } from './account/Account';
import { TrainingStats } from './trainingStats/TrainingStats';
import s from './Profile.module.scss';
import { Subscribe } from './subscribe/Subscribe';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { useNavigate } from 'react-router';

export const Profile = () => {
  const { data: user } = useProfile();
  const { data: subscription } = useSubscription();
  const { data: stats } = useTrainingStats();

  const navigate = useNavigate();
  return (
    <div className={s.root}>
      <Account
        avatar={user?.telegramPhotoUrl ?? undefined}
        name={user?.firstName ?? 'Пользователь'}
        subscription={subscription}
      />
      <TrainingStats stats={stats} />
      <Subscribe />

      { user?.role === 'admin' && ( <PrimaryButton onClick={() => navigate('/admin')}>Перейти в админку</PrimaryButton>)}
    </div>
  );
};
