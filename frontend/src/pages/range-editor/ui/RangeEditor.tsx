import clsx from 'clsx';
import s from './RangeEditor.module.scss';
import { typography } from '$/shared/typography/typography';
import { RangeEditorForm } from './form/RangeEditorForm';

export const RangeEditor = () => {
  return (
    <div className={s.root}>
      <div className={s.headingWrapper}>
        <h3 className={clsx(s.title, typography({ variant: 'headingSm', color: 'white' }))}>
          Редактор диапозонов
        </h3>
        <p className={clsx(s.subtitle, typography({ variant: 'caption', color: 'gray-500' }))}>
          Создай и настрой диапозон рук для любой ситуации
        </p>
      </div>
      <div className={s.content}>
        <RangeEditorForm />
      </div>
    </div>
  );
};
