// model/config.ts
import { SubscriptionPlan } from '$/shared/api/schemas'

interface TariffData {
  id: number
  plan: SubscriptionPlan
  title: string
  price: string
  description: string
  features: string[]
  caption?: string
}

export const TARIFF_PLAN: TariffData[] = [
  {
    id: 1,
    plan: 'basic',
    title: 'Basic',
    price: '499₽',
    description: 'Для начинающих',
    features: [
      '📊 20 активных диапазонов',
      '🤖 30 AI-анализов в день',
      '💡 300 AI-запросов в месяц',
    ],
  },
  {
    id: 2,
    plan: 'pro',
    title: 'PRO',
    price: '999₽',
    description: 'Для регулярных игроков',
    features: [
      '🚀 100 активных диапазонов',
      '💡 100 AI-анализов в день',
      '📈 1500 AI-запросов в месяц',
    ],
    caption: 'хит',
  },
  {
    id: 3,
    plan: 'unlimited',
    title: 'Unlimited',
    price: '1999₽',
    description: 'Для профессионалов',
    features: [
      '♾️ Безлимит активных диапазонов',
      '🧠 Безлимит AI-аналитики',
      '⚡ Максимальная производительность',
    ],
  },
]