import { useState } from 'react';
import clsx from 'clsx';
import s from './ReferralBlock.module.scss';
import { typography } from '$/shared/typography/typography';
import { useReferralStats } from '../model/refferal.queries';

export const ReferralBlock = () => {
  const { data: stats } = useReferralStats();
  const [copied, setCopied] = useState(false);

  if (!stats) return null;

  function copyCode() {
    navigator.clipboard.writeText(stats!.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={s.root}>
      <p className={clsx(s.title, typography({ variant: 'bodySmSemiBold', color: 'white' }))}>
        Реферальная программа
      </p>
      <p className={clsx(s.subtitle, typography({ variant: 'caption', color: 'gray-500' }))}>
        Приглашай друзей — получай месяц подписки за каждую их оплату
      </p>

      <div className={s.codeBlock}>
        <span className={clsx(s.code, typography({ variant: 'bodySmSemiBold', color: 'white' }))}>
          {stats.promoCode}
        </span>
        <button className={s.copyBtn} onClick={copyCode}>
          {copied ? '✓' : 'Копировать'}
        </button>
      </div>

      <div className={s.stats}>
        <div className={s.stat}>
          <span className={clsx(typography({ variant: 'headingSm', color: 'white' }))}>
            {stats.total}
          </span>
          <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
            Приглашено
          </span>
        </div>
        <div className={s.stat}>
          <span className={clsx(typography({ variant: 'headingSm' }))}>{stats.rewarded}</span>
          <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
            Оплатили
          </span>
        </div>
        <div className={s.stat}>
          <span className={clsx(typography({ variant: 'headingSm' }))}>{stats.pending}</span>
          <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
            Ожидают
          </span>
        </div>
      </div>
    </div>
  );
};
