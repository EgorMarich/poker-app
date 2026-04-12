import { ButtonHTMLAttributes } from 'react';
import s from './ResetButtons.module.scss';
import Reset from './assets/reset.svg?react';

export const ResetButton = ({ ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={s.button} {...props}>
      <Reset />
    </button>
  );
};
