import s from './Textarea.module.scss';
import { ChangeEvent } from 'react';
import clsx from 'clsx';
import { typography } from '$/shared/typography/typography';

interface TextareaProps {
  placeholder?: string;
  type?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  name,
}: TextareaProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <label className={clsx(s.label, typography({ variant: 'bodySmSemiBold'}))}>
      {label}
      <textarea
        placeholder={placeholder}
        className={s.textarea}
        value={value ?? ''}
        onChange={handleChange}
        name={name}
      />
    </label>
  );
}