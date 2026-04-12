import { useState, ReactNode } from 'react';
import { ModalContext } from './ModalContext';
import { ModalConfig } from './model/types';
import { ModalOverlay } from './modalOverlay/ModalOverlay';

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const renderModalComponent = (component: ModalConfig['component']): ReactNode => {
  if (typeof component === 'function') {
    return component();
  }
  return component;
};

  const openModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalConfig(null);
    document.body.style.overflow = 'unset';
    
    if (modalConfig?.onClose) {
      modalConfig.onClose();
    }
  };

  const handleClose = () => {
    if (modalConfig?.closeOnOverlayClick !== false) {
      closeModal();
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modalConfig?.closeOnEscape !== false) {
      closeModal();
    }
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      <ModalOverlay
        isOpen={isOpen}
        onClose={handleClose}
        onEscape={handleEscape}
      >
        {modalConfig && renderModalComponent(modalConfig.component)}
      </ModalOverlay>
    </ModalContext.Provider>
  );
};