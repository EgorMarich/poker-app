import s from './variants.module.scss';

export type colorVariants =
  | 'black'
  | 'white'
  | 'gray-500'
  | 'vkontakte'
  | 'blue-700'
  | 'gray-400'
  | 'gray-500'
  | 'gray-600'
  | 'gray-700'
  | 'gray-800';

export interface colorProps {
  color: colorVariants;
}

export const color = ({ color }: colorProps) => {
  return color && s[`color_${color}`];
};
