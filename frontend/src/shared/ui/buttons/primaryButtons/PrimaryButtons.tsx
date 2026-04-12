import { ButtonHTMLAttributes } from 'react';
import s from './PrimaryButton.module.scss';
import clsx from 'clsx';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  classnames?: string;
}

export const PrimaryButton = ({ children, classnames, ...props }: PrimaryButtonProps) => {
  return (
    <button className={clsx(s.button, classnames)} {...props}>
      {children}
    </button>
  );
};
