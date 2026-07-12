'use client';

import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'command';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  before?: ReactNode;
  after?: ReactNode;
  isLoading?: boolean;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      before,
      after,
      children,
      isLoading,
      disabled,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const baseClass = 'os-button';
    const variantClass = variant ? `${baseClass}--${variant}` : '';
    const sizeClass = `${baseClass}--${size}`;
    const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        type={rest.type ?? 'button'}
        disabled={disabled || isLoading}
        aria-busy={isLoading ? 'true' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        {...rest}
      >
        {before ? <span className="os-button__prefix" aria-hidden={typeof before !== 'string'}>{before}</span> : null}
        <span className="os-button__label">{children}</span>
        {after ? <span className="os-button__suffix" aria-hidden={typeof after !== 'string'}>{after}</span> : null}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
