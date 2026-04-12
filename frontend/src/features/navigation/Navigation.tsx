import { NavLink } from 'react-router';
import { MENU } from './config/data';
import s from './Navigation.module.scss';

export const Navigation = () => {
  return (
    <nav className={s.navigation}>
      <ul className={s.list}>
        {MENU.map(item => {
          return (
            <li key={item.id} className={s.item}>
              <NavLink
                to={item.href}
                className={({ isActive }) => (isActive ? `${s.link} ${s.active}` : s.link)}
              >
                <item.icon className={s.icon} />
                {item.title && <span className={s.label}>{item.title}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
