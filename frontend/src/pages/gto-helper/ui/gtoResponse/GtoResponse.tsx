import { typography } from '$/shared/typography/typography';
import clsx from 'clsx';
import s from './GtoResponse.module.scss';

export const GtoResponse = ({
  aiResponse,
  isPending,
}: {
  aiResponse: string;
  isPending: boolean;
}) => {
  if (!aiResponse && !isPending) return null;

  const match = aiResponse?.match(/\*\*([^*]+)\*\*/);
  const highlightedWord = match ? match[1] : null;

  const cleanText = aiResponse?.replace(/\*\*([^*]+)\*\*/, '').trim();

  return (
    <div className={s.root}>
      <p className={clsx(s.label, typography({ variant: 'bodySmSemiBold', color: 'gray-400' }))}>
        {isPending ? 'Анализирую...' : 'GTO совет'}
      </p>
      <div className={clsx(s.response, typography({ variant: 'bodyMd' }))}>
        {isPending ? (
          '...'
        ) : (
          <>
            <span className={clsx(s.highlighted, typography({ variant: 'headingMd' }))}>
              {highlightedWord}
            </span>
            <p>{cleanText && `${cleanText}`}</p>
          </>
        )}
      </div>
    </div>
  );
};
