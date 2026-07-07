import { typography } from '$/shared/typography/typography';
import DinoImage from './asssets/dino_telegram.png';

export const Stub = () => {
  return (
    <div className="stub">
      <h1 className={typography({ variant: 'headingLg' })}>
        Данное приложение доступно только в Telegram
      </h1>
      <img src={DinoImage} alt="Dino" />
    </div>
  );
};
