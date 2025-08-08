import React from 'react';
import { currentTheme } from '../../theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'sm', 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return `bg-${currentTheme.colors.primary.replace('-500', '-100')} text-${currentTheme.colors.primary.replace('-500', '-800')}`;
      case 'success':
        return `bg-${currentTheme.colors.success.replace('-500', '-100')} text-${currentTheme.colors.success.replace('-500', '-800')}`;
      case 'warning':
        return `bg-${currentTheme.colors.warning.replace('-500', '-100')} text-${currentTheme.colors.warning.replace('-500', '-800')}`;
      case 'danger':
        return `bg-${currentTheme.colors.danger.replace('-500', '-100')} text-${currentTheme.colors.danger.replace('-500', '-800')}`;
      case 'info':
        return `bg-${currentTheme.colors.secondary.replace('-500', '-100')} text-${currentTheme.colors.secondary.replace('-500', '-800')}`;
      default:
        return `bg-${currentTheme.colors.primary.replace('-500', '-100')} text-${currentTheme.colors.primary.replace('-500', '-800')}`;
    }
  };
  
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  const classes = `${baseClasses} ${getVariantClasses(variant)} ${sizeClasses[size]} ${className}`;
  
  return <span className={classes}>{children}</span>;
};

export default Badge;