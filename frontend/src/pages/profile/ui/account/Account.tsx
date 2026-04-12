import { typography } from '$/shared/typography/typography'
import s from './account.module.scss'
import ProfileIcon from './assets/pfile.svg?react'
import clsx from 'clsx'
import type { Subscription } from '$/shared/api/schemas'

interface AccountProps {
  avatar?: string
  name: string
  subscription?: Subscription | null
}

const PLAN_LABELS = {
  free: 'Бесплатный план',
  basic: 'Basic',
  pro: 'Pro',
  unlimited: 'Unlimited',
}

const PLAN_COLORS = {
  free: s.planFree,
  basic: s.planBasic,
  pro: s.planPro,
  unlimited: s.planUnlimited,
}

export const Account = ({ avatar, name, subscription }: AccountProps) => {
  const plan = subscription?.plan ?? 'free'
  const expiresAt = subscription?.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString('ru-RU')
    : null

  return (
    <div className={s.root}>
      <div className={s.user}>
        {avatar ? (
          <img src={avatar} alt="avatar" className={s.image} />
        ) : (
          <ProfileIcon className={s.icon} />
        )}
        <div className={s.info}>
          <div className={typography({ variant: 'bodySmSemiBold' })}>
            {name}
          </div>
          <div className={clsx(s.plan, PLAN_COLORS[plan])}>
            {PLAN_LABELS[plan]}
          </div>
        </div>
      </div>

      <div className={s.subscriptionBlock}>
        {plan === 'free' ? (
          <p className={clsx(s.subText, typography({ variant: 'caption', color: 'gray-500' }))}>
            Нет активной подписки
          </p>
        ) : (
          <p className={clsx(s.subText, typography({ variant: 'caption', color: 'gray-500' }))}>
            Активна{expiresAt ? ` до ${expiresAt}` : ''}
          </p>
        )}
      </div>
    </div>
  )
}