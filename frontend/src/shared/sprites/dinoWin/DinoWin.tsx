import s from './CrocodileWin.module.scss';
import DinoWinImage from '../assets/DinoWin.png'

export const DinoWin = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.glow} />

      <img
        src={DinoWinImage}
        alt="dino win"
        className={s.crocodile}
      />

      <div className={s.sparkle1}>✦</div>
      <div className={s.sparkle2}>✦</div>
      <div className={s.sparkle3}>✦</div>
    </div>
  );
};