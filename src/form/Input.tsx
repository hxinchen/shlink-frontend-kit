import { clsx } from 'clsx';
import type { FC, InputHTMLAttributes, Ref } from 'react';
import type { Size } from '../types';

export type BaseInputProps = {
  size?: Size;
  feedback?: 'error';

  /**
   * Whether the input should have an opinionated style or not. Defaults to 'default'.
   * An unstyled input can be useful to wrap or customize.
   */
  variant?: 'default' | 'unstyled';
};

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'checked' | 'defaultChecked'> &
  BaseInputProps & {
    borderless?: boolean;
    ref?: Ref<HTMLInputElement>;
  };

export const Input: FC<InputProps> = ({
  borderless = false,
  size = 'md',
  feedback,
  variant = 'default',
  className,
  disabled,
  ref,
  ...rest
}) => (
  <input
    ref={ref}
    className={clsx(
      'outline-none',
      variant === 'default' && [
        'w-full',
        {
          'focus-ring': !feedback,
          'focus-ring-danger': feedback === 'error',

          // iOS zooms the page in when focusing inputs with a font size smaller than 16px, so use that on small screens
          'px-2 py-1 text-sm max-md:text-base': size === 'sm',
          'px-3 py-1.5': size === 'md',
          'px-4 py-2 text-xl': size === 'lg',

          'rounded-md border': !borderless,
          'border-lm-input-border dark:border-dm-input-border': !borderless && !feedback,
          'border-danger': !borderless && feedback === 'error',

          'bg-lm-disabled-input dark:bg-dm-disabled-input': disabled,
          'bg-lm-primary dark:bg-dm-primary': !disabled,
          // Use different background color when rendered inside a card
          'group-[&]/card:bg-lm-input group-[&]/card:dark:bg-dm-input': !disabled,
          'transition-[border-color,box-shadow,background-color] duration-[160ms]': !borderless,
        },
      ],
      className,
    )}
    disabled={disabled}
    {...rest}
  />
);
