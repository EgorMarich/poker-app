import s from './DinoLose.module.scss';
import DinoLoseImage from '../assets/DinoLose.png';

export const DinoLose = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.glow} />

      <img src={DinoLoseImage} alt="dino lose" className={s.crocodile} />
{/* 
      <div className={s.sparkle1}>✦</div>
      <div className={s.sparkle2}>✦</div>
      <div className={s.sparkle3}>✦</div> */}
    </div>
  );
};
