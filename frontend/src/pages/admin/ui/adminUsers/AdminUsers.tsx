/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react'
import clsx from 'clsx'
import s from './AdminUsers.module.scss'
import { typography } from '$/shared/typography/typography'
import {
  useAdminUsers,
  useSetUserPlan,
  useSetUserActive,
  useSetUserRole,
} from '$/entities/admin/model/admin.queries'

const PLANS = ['free', 'basic', 'pro', 'unlimited'] as const

export const AdminUsers = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminUsers(page)
  const { mutate: setPlan } = useSetUserPlan()
  const { mutate: setActive } = useSetUserActive()
  const { mutate: setRole } = useSetUserRole()

  if (isLoading) return (
    <p className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
      Загрузка...
    </p>
  )

  return (
    <div className={s.root}>
      {data?.users.map((user: any) => (
        <div key={user.id} className={s.userCard}>

          <div className={s.userHeader}>
            <div>
              <p className={clsx(s.userName, typography({ variant: 'bodySmSemiBold', color: 'white' }))}>
                {user.firstName ?? user.telegramUsername ?? 'Без имени'}
              </p>
              <p className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
                {user.email ?? `tg: ${user.telegramUsername ?? '—'}`}
              </p>
            </div>
            <span className={clsx(s.roleBadge, user.role === 'admin' && s.roleAdmin)}>
              {user.role}
            </span>
          </div>

          {/* Подписка */}
          <div className={s.row}>
            <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
              План:
            </span>
            <select
              className={s.select}
              value={user.subscription?.plan ?? 'free'}
              onChange={(e) => setPlan({ userId: user.id, plan: e.target.value as any })}
            >
              {PLANS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Действия */}
          <div className={s.actions}>
            <button
              className={clsx(s.btn, user.isActive ? s.btnDanger : s.btnSuccess)}
              onClick={() => setActive({ userId: user.id, isActive: !user.isActive })}
            >
              {user.isActive ? 'Заблокировать' : 'Разблокировать'}
            </button>
            <button
              className={clsx(s.btn, s.btnSecondary)}
              onClick={() => setRole({
                userId: user.id,
                role: user.role === 'admin' ? 'user' : 'admin',
              })}
            >
              {user.role === 'admin' ? '→ User' : '→ Admin'}
            </button>
          </div>

        </div>
      ))}

      {/* Пагинация */}
      {data && data.pages > 1 && (
        <div className={s.pagination}>
          <button
            className={s.pageBtn}
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ←
          </button>
          <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
            {page} / {data.pages}
          </span>
          <button
            className={s.pageBtn}
            disabled={page === data.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}