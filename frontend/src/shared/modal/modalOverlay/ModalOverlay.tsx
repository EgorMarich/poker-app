// shared/lib/modal/ModalOverlay.tsx
import { ReactNode, useEffect } from 'react';
import s from './ModalOverlay.module.scss';

interface ModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onEscape: (e: KeyboardEvent) => void;
  children: ReactNode;
}

export const ModalOverlay = ({ isOpen, onClose, onEscape, children }: ModalOverlayProps) => {
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', onEscape);
      return () => document.removeEventListener('keydown', onEscape);
    }
  }, [isOpen, onEscape]);

  if (!isOpen) return null;

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.content} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};