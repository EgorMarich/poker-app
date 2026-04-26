import clsx from 'clsx';
import s from './Subscribe.module.scss';
import { typography } from '$/shared/typography/typography';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

interface SubscribeProps {
  start?: string;
  end?: string;
}

export const Subscribe = ({ start, end }: SubscribeProps) => {

  const navigate = useNavigate()

  const { t } = useTranslation();
  return (
    <div className={s.root}>
      <h4 className={clsx(s.title, typography({ variant: 'bodySmSemiBold', color: 'white' }))}>
        { t('subscription.title') }
      </h4>

      <div className={s.card}>
        <div className={s.start}>
          <p>{ t('subscription.startAt') }: {start ?? '-'} </p>
        </div>

        <div className={s.end}>
          <p>{ t('subscription.expiresAt') }: {end ?? '-'} </p>
        </div>
      </div>

      <PrimaryButton onClick={() => navigate('/tariff')}>
        { t('subscription.selectSubscription') }
      </PrimaryButton>
    </div>
  );
};
