import clsx from 'clsx';
import { color, type colorVariants } from '../colors/colors';
import s from './variants.module.scss';

export type TypographyVariants =
  | 'headingLg'
  | 'headingMd'
  | 'headingSm'
  | 'caption'
  | 'bodyMd'
  | 'bodySm'
  | 'bodyMdSemiBold'
  | 'bodySmSemiBold';

export interface TypographyProps {
  variant: TypographyVariants;
  color?: colorVariants;
}

export const typography = ({ variant, color: colorProp }: TypographyProps) => {
  return clsx(
    s.typography,
    variant && s[`typography_${variant}`],
    colorProp && color({ color: colorProp })
  );
};
