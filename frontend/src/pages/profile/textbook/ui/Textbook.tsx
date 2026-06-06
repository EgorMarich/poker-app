import RootAccordion from '$/shared/ui/accordion/RootAccordion';
import { BackButton } from '$/shared/ui/buttons/backButton/BackButton';
import { useNavigate } from 'react-router';
import { DATA_LESSONS } from '../config/data';
import { LessonCard } from './lessonCard/LessonCard';
import s from './Textbook.module.scss';

export const Textbook = () => {
  const textbook = DATA_LESSONS[0];

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/profile');
  }
  return (
    <div className={s.root}>
      <BackButton onClick={handleBack} classnames={s.backButton} />
      {textbook.lessons.map(lesson => (
        <div className={s.lessonWrapper} key={lesson.id}>
          <RootAccordion title={lesson.title}>
            <LessonCard lesson={lesson} />
          </RootAccordion>
        </div>
      ))}
    </div>
  );
};
