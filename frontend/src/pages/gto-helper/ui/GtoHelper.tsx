import { useGtoHelper } from "$/shared/hooks/useGtoHelper"
import { typography } from "$/shared/typography/typography"
import clsx from "clsx"
import { GtoHelperForm } from "./gtoHelperForm/GtoHelperForm"
import { GtoResponse } from "./gtoResponse/GtoResponse"
import s from './GtoHelper.module.scss'
import { useTranslation } from "react-i18next"

export const GtoHelper = () => {
  const { t } = useTranslation()
  const { aiResponse, isPending, submit } = useGtoHelper()

  return (
    <div className={s.root}>
      <div className={s.headingWrapper}>
        <h3 className={clsx(s.title, typography({ variant: 'headingSm', color: 'white' }))}>
          { t('gto.title')}
        </h3>
        <p className={clsx(s.subtitle, typography({ variant: 'caption', color: 'gray-500' }))}>
          { t('gto.subtitle')}
        </p>
      </div>

      <GtoHelperForm
        onSubmit={submit}
        isPending={isPending}
        // rangeItems={rangeItems}
      />

      <GtoResponse aiResponse={aiResponse} isPending={isPending} />
    </div>
  )
}