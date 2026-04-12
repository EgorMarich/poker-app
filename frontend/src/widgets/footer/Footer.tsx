import { Navigation } from "$/features/navigation/Navigation";
import s from "./Footer.module.scss";


export const Footer = () => {
  return (
    <div className={s.root}>
      <Navigation />
    </div>
  );
};
