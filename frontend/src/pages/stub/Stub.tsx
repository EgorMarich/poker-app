import DinoImage from './asssets/dino_telegram.png';
import s from './Stub.module.scss';

export const Stub = () => {
  return (
    <div className={s.stub}>
      <h1 className={s.title}>Данное приложение доступно только в Telegram</h1>
      <img src={DinoImage} alt="Dino" className={s.image} />
    </div>
  );
};
