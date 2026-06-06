import * as React from 'react';
import { Accordion } from '@base-ui/react/accordion';
import s from './RootAccordion.module.scss'
import { LocalizedString } from '$/pages/profile/textbook/config/types';
import { getLocalized } from '$/pages/profile/textbook/utils/GetLocalized';
import { useTranslation } from 'react-i18next';

interface RootAccordionProps {
  children: React.ReactNode;
  title: LocalizedString;
}

export default function RootAccordion({ children, title }: RootAccordionProps) {
  const { i18n } = useTranslation();
  const language = i18n.language;
  return (
    <Accordion.Root className={s.Accordion}>
      <Accordion.Item className={s.Item}>
        <Accordion.Header className={s.Header}>
          <Accordion.Trigger className={s.Trigger}>
            {getLocalized(title, language)}
            <PlusIcon className={s.Icon} />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel className={s.Panel}>
          <div className={s.Content}>{children}</div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      {...props}
      style={{ display: 'block', ...props.style }}
    >
      <path d="M1.5 8h13M8 14.5v-13" />
    </svg>
  );
}
