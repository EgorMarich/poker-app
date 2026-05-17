import s from './CrocodileCoder.module.scss';
import DinoAiImage from '../assets/DinoAi.png';

export const DinoAi = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.glow} />

      <div className={s.question1}>?</div>
      <div className={s.question2}>?</div>

      <div className={s.screenLight} />

      <img
        src={DinoAiImage}
        alt="Dino Ai"
        className={s.image}
        draggable={false}
      />
    </div>
  );
};
