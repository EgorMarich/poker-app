import clsx from 'clsx'
import s from './GtoResponse.module.scss'
import { typography } from '$/shared/typography/typography'

interface GtoResponseProps {
  aiResponse: string | null
  isPending: boolean
}

export const GtoResponse = ({ aiResponse, isPending }: GtoResponseProps) => {
  if (!aiResponse && !isPending) return null

  const response = aiResponse &&  aiResponse.replace('*', '')

  return (
    <div className={s.root}>
      <p className={clsx(s.label, typography({ variant: 'bodySmSemiBold', color: 'gray-400' }))}>
        {isPending ? 'Анализирую...' : 'GTO совет'}
      </p>
      <div className={clsx(s.response, typography({ variant: 'bodyMd', color: 'vkontakte' }))}>
        {isPending ? '...' : response}
      </div>
    </div>
  )
}