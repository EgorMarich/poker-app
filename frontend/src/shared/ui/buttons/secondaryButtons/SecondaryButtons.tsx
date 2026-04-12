import { ButtonHTMLAttributes, ReactNode } from 'react';
import s from './SecondaryButtons.module.scss';
import Plus from './assets/plus.svg?react';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: boolean;
}

export const SecondaryButton = ({ children, icon = false, ...props }: SecondaryButtonProps) => {
  return (
    <button className={s.button} {...props}>
      {icon && <Plus />}
      {children}
    </button>
  );
};
