import { useState } from 'react'
import { useNavigate } from 'react-router'
import { TARIFF_PLAN } from '../model/config'
import { Card } from './card/Card'
import { useCreatePayment, useSubscription } from '$/entities/payments/model/payments.queries'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '$/shared/api/query-keys'
import s from './Tariff.module.scss'

export const Tariff = () => {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: subscription } = useSubscription()
  const { mutate: createPayment, isPending } = useCreatePayment()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [successPlan, setSuccessPlan] = useState<string | null>(null)

  function handleSelect(plan: string) {
    setLoadingPlan(plan)
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    createPayment(plan as any, {
      onSuccess: (res) => {
        setLoadingPlan(null)

        if (res.testMode) {
          // Тестовый режим — показываем успех и обновляем данные
          setSuccessPlan(plan)
          qc.invalidateQueries({ queryKey: queryKeys.payments.subscription })
          qc.invalidateQueries({ queryKey: queryKeys.profile })
          setTimeout(() => navigate('/profile'), 2000)
          return
        }

        // Реальный режим — редирект на ЮКассу
        if (res.confirmationUrl) {
          window.location.href = res.confirmationUrl
        }
      },
      onError: () => setLoadingPlan(null),
    })
  }

  return (
    <div className={s.root}>
      <button className={s.back} onClick={() => navigate('/profile')}>←</button>

      {successPlan && (
        <div className={s.successBanner}>
          ✅ Подписка активирована! Перенаправляем...
        </div>
      )}

      {TARIFF_PLAN.map(item => (
        <Card
          key={item.id}
          {...item}
          isActive={subscription?.plan === item.plan}
          isLoading={loadingPlan === item.plan}
          isSuccess={successPlan === item.plan}
          onSelect={() => handleSelect(item.plan)}
          disabled={isPending || subscription?.plan === item.plan}
        />
      ))}
    </div>
  )
}