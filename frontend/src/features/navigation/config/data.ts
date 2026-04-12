import Book from '../assets/book.svg?react';
import Calculator from '../assets/calculator.svg?react';
import Editor from '../assets/editor.svg?react';
import Gto from '../assets/gto.svg?react';
import Profile from '../assets/profile.svg?react';

export const MENU = [
  {
    id: 1,
    title: 'Библиотека',
    icon: Book,
    href: '/',
  },
  {
    id: 2,
    icon: Calculator,
    title: 'Калькулятор',
    href: '/calculator',
  },
  {
    id: 3,
    icon: Gto,
    title: 'Помощник',
    href: '/gto-helper',
  },
  {
    id: 4,
    icon: Editor,
    title: 'Редактор',
    href: '/range-editor',
  },
  {
    id: 5,
    icon: Profile,
    title: 'Профиль',
    href: '/profile',
  },
];
