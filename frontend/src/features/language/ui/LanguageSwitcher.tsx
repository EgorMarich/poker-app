import { useTranslation } from 'react-i18next'
import s from './LanguageSwitcher.module.scss'
import clsx from 'clsx'

const LANGUAGES = [
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const current = i18n.language

  return (
    <div className={s.root}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={clsx(s.btn, current.startsWith(lang.code) && s.active)}
          onClick={() => i18n.changeLanguage(lang.code)}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  )
}