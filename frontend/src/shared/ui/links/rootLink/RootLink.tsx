import { ReactNode } from 'react';
import { Link } from 'react-router';
import s from './RootLink.module.scss';
import Plus from './assets/plus.svg?react';

interface RootLinkProps {
  href: string;
  children: ReactNode;
  icon?: boolean;
}

export const RootLink = ({ href, children, icon = false }: RootLinkProps) => {
  return (
    <Link className={s.link} to={href}>
      {icon && <Plus />}
      {children}
    </Link>
  );
};
