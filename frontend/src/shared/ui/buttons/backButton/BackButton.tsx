import clsx from 'clsx';
import BackIcon from './assets/back.svg?react';
import s from './BackButton.module.scss';

export const BackButton = ({ onClick, classnames }: { onClick: () => void, classnames?: string }) => {
  return (
    <button className={clsx(s.back, classnames)} onClick={onClick}>
      <BackIcon />
    </button>
  );
};
