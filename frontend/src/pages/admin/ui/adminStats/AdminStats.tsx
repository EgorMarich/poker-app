/* eslint-disable @typescript-eslint/no-explicit-any */

import clsx from 'clsx'
import s from './AdminStats.module.scss'
import { typography } from '$/shared/typography/typography'
import { useAdminStats } from '$/entities/admin/model/admin.queries'

export const AdminStats = () => {
  const { data: stats, isLoading } = useAdminStats()

  if (isLoading) return (
    <p className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
      Загрузка...
    </p>
  )

  if (!stats) return null

  return (
    <div className={s.root}>

      {/* Пользователи */}
      <div className={s.section}>
        <p className={clsx(s.sectionTitle, typography({ variant: 'bodySmSemiBold', color: 'gray-400' }))}>
          Пользователи
        </p>
        <div className={s.grid}>
          <StatCard label="Всего" value={stats.users.total} />
          <StatCard label="Активных" value={stats.users.active} />
          <StatCard label="AI запросов" value={stats.aiQueries.total} />
          <StatCard label="Диапазонов" value={stats.ranges.total} />
        </div>
      </div>

      {/* Выручка */}
      <div className={s.section}>
        <p className={clsx(s.sectionTitle, typography({ variant: 'bodySmSemiBold', color: 'gray-400' }))}>
          Выручка
        </p>
        <div className={s.revenueCard}>
          <span className={clsx(typography({ variant: 'headingSm', color: 'white' }))}>
            {stats.revenue.total.toLocaleString('ru-RU')} ₽
          </span>
          <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
            всего оплат
          </span>
        </div>
      </div>

      {/* Распределение планов */}
      <div className={s.section}>
        <p className={clsx(s.sectionTitle, typography({ variant: 'bodySmSemiBold', color: 'gray-400' }))}>
          Планы
        </p>
        <div className={s.plans}>
          {stats.planDistribution.map((p: any) => (
            <div key={p.plan} className={s.planRow}>
              <span className={clsx(typography({ variant: 'bodySm', color: 'white' }))}>
                {p.plan}
              </span>
              <span className={clsx(typography({ variant: 'bodySmSemiBold'}))}>
                {p.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Последние регистрации */}
      <div className={s.section}>
        <p className={clsx(s.sectionTitle, typography({ variant: 'bodySmSemiBold', color: 'gray-400' }))}>
          Последние регистрации
        </p>
        <div className={s.signups}>
          {stats.recentSignups.map((u: any) => (
            <div key={u.id} className={s.signupRow}>
              <span className={clsx(typography({ variant: 'bodySm', color: 'white' }))}>
                {u.firstName ?? u.email ?? 'Без имени'}
              </span>
              <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
                {new Date(u.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className={s.statCard}>
      <span className={clsx(typography({ variant: 'headingSm', color: 'white' }))}>
        {value}
      </span>
      <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
        {label}
      </span>
    </div>
  )
}