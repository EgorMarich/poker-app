import clsx from 'clsx';
import s from './Calculator.module.scss';
import { typography } from '$/shared/typography/typography';
import { CalculatorForm } from './calculatorForm/CalculatorForm';

export const Calculator = () => {
  return (
    <div className={s.root}>
      <div className={s.headingWrapper}>
        <h3 className={clsx(s.title, typography({ variant: 'headingSm', color: 'white' }))}>
          Калькулятор эквити
        </h3>
        <p className={clsx(s.subtitle, typography({ variant: 'caption', color: 'gray-500' }))}>
          Расчитай шансы на победу против соперника
        </p>
      </div>
      <div className={s.content}>
        <CalculatorForm />
      </div>
    </div>
  );
};
