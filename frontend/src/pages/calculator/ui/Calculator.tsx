import clsx from 'clsx';
import s from './Calculator.module.scss';
import { typography } from '$/shared/typography/typography';
import { CalculatorForm } from './calculatorForm/CalculatorForm';
import { useTranslation } from 'react-i18next';

export const Calculator = () => {
  const { t } = useTranslation();
  return (
    <div className={s.root}>
      <div className={s.headingWrapper}>
        <h3 className={clsx(s.title, typography({ variant: 'headingSm', color: 'white' }))}>
          { t('calculator.title') }
        </h3>
        <p className={clsx(s.subtitle, typography({ variant: 'caption', color: 'gray-500' }))}>
          { t('calculator.subtitle') }
        </p>
      </div>
      <div className={s.content}>
        <CalculatorForm />
      </div>
    </div>
  );
};
