
import { ReactNode } from 'react';

export type ModalComponent = ReactNode | (() => ReactNode);

export interface ModalConfig {
  component: ModalComponent;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  isOpen: boolean;
}