import { typography } from '$/shared/typography/typography'
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons'
import { clsx } from 'clsx'
import s from './Card.module.scss'

interface CardProps {
  id: number
  plan: string
  title: string
  price: string
  description: string
  features: string[]
  caption?: string
  isActive?: boolean
  isLoading?: boolean
  isSuccess?: boolean
  disabled?: boolean
  onSelect: () => void
}

export const Card = ({
  title, price, description, features, caption,
  isActive, isLoading, isSuccess, disabled, onSelect,
}: CardProps) => {
  function getButtonLabel() {
    if (isSuccess) return '✅ Активировано'
    if (isLoading) return 'Оформляем...'
    if (isActive) return 'Текущий план'
    return 'Выбрать'
  }

  return (
    <div className={clsx(s.root, isActive && s.rootActive)}>
      <div className={s.headingWrapper}>
        {caption && (
          <span className={clsx(s.caption, typography({ variant: 'bodySm' }))}>
            {caption}
          </span>
        )}
        {isActive && (
          <span className={s.activeBadge}>активен</span>
        )}
        <h1 className={typography({ variant: 'headingMd' })}>{title}</h1>
      </div>

      <div className={s.price}>
        <span className={typography({ variant: 'headingMd' })}>{price}</span>
        /месяц
      </div>

      {description}

      <div className={s.divider} />

      <div className={s.features}>
        {features.map((feature, index) => (
          <div key={index}>{feature}</div>
        ))}
      </div>

      <PrimaryButton
        classnames={s.button}
        disabled={disabled || isLoading || isSuccess}
        onClick={onSelect}
      >
        {getButtonLabel()}
      </PrimaryButton>
    </div>
  )
}