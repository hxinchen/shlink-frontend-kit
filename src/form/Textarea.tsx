import { clsx } from 'clsx';
import type { FC, Ref, TextareaHTMLAttributes } from 'react';
import type { BaseInputProps } from './Input';

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> &
  BaseInputProps & {
    ref?: Ref<HTMLTextAreaElement>;
  };

export const Textarea: FC<TextareaProps> = ({
  size = 'md',
  feedback,
  variant = 'default',
  className,
  disabled,
  rows,
  ref,
  ...rest
}) => (
  <textarea
    ref={ref}
    rows={rows ?? 3}
    className={clsx(
      'outline-none resize-y rounded-md border',
      'transition-[border-color,box-shadow,background-color] duration-[160ms]',
      variant === 'default' && [
        'w-full',
        {
          'focus-ring': !feedback,
          'focus-ring-danger': feedback === 'error',

          'px-2 py-1 text-sm': size === 'sm',
          'px-3 py-1.5': size === 'md',
          'px-4 py-2 text-xl': size === 'lg',

          'border-lm-input-border dark:border-dm-input-border': !feedback,
          'border-danger': feedback === 'error',

          'bg-lm-disabled-input dark:bg-dm-disabled-input': disabled,
          'bg-lm-primary dark:bg-dm-primary': !disabled,
          // Use different background color when rendered inside a card
          'group-[&]/card:bg-lm-input group-[&]/card:dark:bg-dm-input': !disabled,
        },
      ],
      className,
    )}
    disabled={disabled}
    {...rest}
  />
);
