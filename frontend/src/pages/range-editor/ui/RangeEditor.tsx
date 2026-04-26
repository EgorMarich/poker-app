import clsx from 'clsx';
import s from './RangeEditor.module.scss';
import { typography } from '$/shared/typography/typography';
import { RangeEditorForm } from './form/RangeEditorForm';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export const RangeEditor = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className={s.root}>
      <div className={s.headingWrapper}>
        <h3 className={clsx(s.title, typography({ variant: 'headingSm', color: 'white' }))}>
          {t('ranges.title')}
        </h3>
        <p className={clsx(s.subtitle, typography({ variant: 'caption', color: 'gray-500' }))}>
          { t('ranges.subtitle') }
        </p>
      </div>
      <div className={s.content}>
        <RangeEditorForm id={id} />
      </div>
    </div>
  );
};
