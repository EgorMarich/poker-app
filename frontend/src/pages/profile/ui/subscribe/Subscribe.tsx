import clsx from 'clsx';
import s from './Subscribe.module.scss';
import { typography } from '$/shared/typography/typography';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { useNavigate } from 'react-router';

interface SubscribeProps {
  start?: string;
  end?: string;
}

export const Subscribe = ({ start, end }: SubscribeProps) => {

  const navigate = useNavigate()
  return (
    <div className={s.root}>
      <h4 className={clsx(s.title, typography({ variant: 'bodySmSemiBold', color: 'white' }))}>
        Подписка
      </h4>

      <div className={s.card}>
        <div className={s.start}>
          <p>Дата начала: {start ?? '-'} </p>
        </div>

        <div className={s.end}>
          <p>Дата окончания: {end ?? '-'}</p>
        </div>
      </div>

      <PrimaryButton onClick={() => navigate('/tariff')}>Выбрать подписку</PrimaryButton>
    </div>
  );
};
