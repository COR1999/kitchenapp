import React from 'react';
import { currentTheme } from '../../theme';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ 
  label,
  required,
  error,
  className = '',
  ...props 
}) => {
  const textAreaClasses = `w-full border rounded-md px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-${currentTheme.colors.primary} focus:border-transparent resize-vertical ${
    error ? `border-${currentTheme.colors.danger.replace('-500', '-300')} focus:ring-${currentTheme.colors.danger}` : `border-${currentTheme.colors.borderMedium}`
  } ${className}`;

  return (
    <div>
      {label && (
        <label className={`block text-sm font-medium text-${currentTheme.colors.textSecondary} mb-1`}>
          {label} {required && <span className={`text-${currentTheme.colors.danger}`}>*</span>}
        </label>
      )}
      <textarea
        className={textAreaClasses}
        {...props}
      />
      {error && (
        <p className={`mt-1 text-sm text-${currentTheme.colors.danger.replace('-500', '-600')}`}>{error}</p>
      )}
    </div>
  );
};

export default TextArea;