import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';

export type BadgeProps = PropsWithChildren<{
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  className?: string;
}>;

/**
 * A small pill-shaped label used to highlight a status, a category or a count.
 */
export const Badge: FC<BadgeProps> = ({ variant = 'default', className, children }) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
      {
        'bg-lm-secondary dark:bg-dm-secondary text-lm-text dark:text-dm-text': variant === 'default',
        'bg-lm-brand dark:bg-dm-brand text-white dark:text-dm-main': variant === 'brand',
        'bg-success text-white': variant === 'success',
        'bg-warning text-black': variant === 'warning',
        'bg-danger text-white': variant === 'danger',
      },
      className,
    )}
  >
    {children}
  </span>
);
