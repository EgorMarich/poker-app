import { useState } from 'react'
import { Navigate } from 'react-router'
import clsx from 'clsx'
import s from './Admin.module.scss'
import { typography } from '$/shared/typography/typography'
import { useProfile } from '$/entities/user/model/auth.queries'
import { AdminStats } from './adminStats/AdminStats'
import { AdminUsers } from './adminUsers/AdminUsers'


type Tab = 'stats' | 'users'

export const Admin = () => {
  const { data: user, isLoading } = useProfile()
  const [tab, setTab] = useState<Tab>('stats')

  if (isLoading) return null

  if (user?.role !== 'admin') return <Navigate to="/" replace />

  return (
    <div className={s.root}>
      <h2 className={clsx(s.title, typography({ variant: 'headingSm', color: 'white' }))}>
        Админ панель
      </h2>

      <div className={s.tabs}>
        <button
          className={clsx(s.tab, tab === 'stats' && s.tabActive)}
          onClick={() => setTab('stats')}
        >
          Статистика
        </button>
        <button
          className={clsx(s.tab, tab === 'users' && s.tabActive)}
          onClick={() => setTab('users')}
        >
          Пользователи
        </button>
      </div>

      {tab === 'stats' && <AdminStats />}
      {tab === 'users' && <AdminUsers />}
    </div>
  )
}