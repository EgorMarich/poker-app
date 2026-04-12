import { Outlet } from 'react-router';
import s from './RootLayout.module.scss';
import { Footer } from '$/widgets/footer/Footer';

export const RootLayout = () => {
  return (
    <div className={s.root}>
      <div className={s.content}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
