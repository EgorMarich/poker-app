import clsx from 'clsx';
import s from './Subscribe.module.scss';
import { typography } from '$/shared/typography/typography';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Subscription } from '$/shared/api/schemas';
import { format } from 'date-fns';

interface SubscribeProps {
  subscription?: Subscription | null;
}

const formatDate = (date?: string | null) => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'dd.MM.yyyy HH:mm');
  } catch {
    return '-';
  }
};

export const Subscribe = ({ subscription }: SubscribeProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={s.root}>
      <h4 className={clsx(s.title, typography({ variant: 'bodySmSemiBold', color: 'white' }))}>
        {t('subscription.title')}
      </h4>

      <div className={s.card}>
        <div className={s.start}>
          <p>
            {t('subscription.startsAt')}: {formatDate(subscription?.startsAt)}
          </p>
        </div>

        <div className={s.end}>
          <p>
            {t('subscription.expiresAt')}: {formatDate(subscription?.expiresAt)}
          </p>
        </div>

        <PrimaryButton onClick={() => navigate('/tariff')}>
          {t('subscription.selectSubscription')}
        </PrimaryButton>
      </div>
    </div>
  );
};
