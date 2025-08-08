import React from 'react';
import { currentTheme } from '../../theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  children: React.ReactNode;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'lg',
  children,
  showCloseButton = true
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className={`fixed inset-0 bg-${currentTheme.colors.modalOverlay} flex items-center justify-center p-4 z-50`}>
      <div className={`bg-${currentTheme.colors.cardBackground} rounded-lg ${sizeClasses[size]} w-full max-h-[90vh] overflow-auto`}>
        {(title || showCloseButton) && (
          <div className={`sticky top-0 bg-${currentTheme.colors.cardBackground} border-b border-${currentTheme.colors.borderLight} p-6`}>
            <div className="flex justify-between items-center">
              {title && (
                <h2 className={`text-2xl font-bold text-${currentTheme.colors.textPrimary}`}>
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={`text-${currentTheme.colors.textMuted} hover:text-${currentTheme.colors.textSecondary} transition-colors`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;