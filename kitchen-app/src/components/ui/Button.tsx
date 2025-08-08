import React from 'react';
import { currentTheme, buildBgClass, buildHoverBgClass } from '../../theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-md transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return `bg-${currentTheme.colors.primary} text-white hover:bg-${currentTheme.colors.primaryHover} focus:ring-${currentTheme.colors.primary}`;
      case 'secondary':
        return `bg-${currentTheme.colors.secondary} text-white hover:bg-${currentTheme.colors.secondaryHover} focus:ring-${currentTheme.colors.secondary}`;
      case 'success':
        return `bg-${currentTheme.colors.success} text-white hover:bg-${currentTheme.colors.successHover} focus:ring-${currentTheme.colors.success}`;
      case 'danger':
        return `bg-${currentTheme.colors.danger} text-white hover:bg-${currentTheme.colors.dangerHover} focus:ring-${currentTheme.colors.danger}`;
      case 'warning':
        return `bg-${currentTheme.colors.warning} text-white hover:bg-${currentTheme.colors.warningHover} focus:ring-${currentTheme.colors.warning}`;
      case 'ghost':
        return `text-${currentTheme.colors.textSecondary} hover:bg-${currentTheme.colors.pageBackground} focus:ring-${currentTheme.colors.secondary}`;
      default:
        return `bg-${currentTheme.colors.primary} text-white hover:bg-${currentTheme.colors.primaryHover} focus:ring-${currentTheme.colors.primary}`;
    }
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const classes = `${baseClasses} ${getVariantClasses(variant)} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;