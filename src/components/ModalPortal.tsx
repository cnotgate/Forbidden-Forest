import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { sounds } from '../utils/soundHelper';

interface ModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalPortal: React.FC<ModalPortalProps> = ({
  isOpen,
  onClose,
  children
}) => {
  // Lock body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      sounds.playClick();
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] isolate">
      {/* 1. Fullscreen Backdrop covering header, navbar, and entire viewport */}
      <div
        className="fixed inset-0 bg-hogwarts-950/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200 cursor-pointer"
        onClick={() => {
          sounds.playClick();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* 2. Scrollable dialog overlay container */}
      <div
        className="fixed inset-0 z-10 flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-pointer"
        onClick={handleBackdropClick}
      >
        <div
          className="my-auto py-2 sm:py-4 flex items-center justify-center w-full max-w-full cursor-pointer"
          onClick={handleBackdropClick}
        >
          <div
            className="cursor-default max-w-full flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

