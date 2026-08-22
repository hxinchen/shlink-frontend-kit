import { clsx } from 'clsx';
import type { FC, HTMLProps } from 'react';

export type CardProps = HTMLProps<HTMLDivElement>;

const Header: FC<CardProps> = ({ className, ...rest }) => (
  <div
    className={clsx(
      'px-4 py-3 rounded-t-md',
      'bg-lm-primary dark:bg-dm-primary border-b border-lm-border dark:border-dm-border',
      className,
    )}
    {...rest}
  />
);

Header.displayName = 'Card.Header';

const Body: FC<CardProps> = ({ className, ...rest }) => (
  <div
    className={clsx(
      'p-4 bg-lm-primary dark:bg-dm-primary first:rounded-t-md',
      'first:rounded-t-md last:rounded-b-md',
      className,
    )}
    {...rest}
  />
);

Body.displayName = 'Card.Body';

const Footer: FC<CardProps> = ({ className, ...rest }) => (
  <div
    className={clsx(
      'px-4 py-3 rounded-b-md',
      'bg-lm-primary dark:bg-dm-primary border-t border-lm-border dark:border-dm-border',
      className,
    )}
    {...rest}
  />
);

Footer.displayName = 'Card.Footer';

const BaseCard: FC<CardProps> = ({ className, ...props }) => (
  <div
    className={clsx(
      'group/card rounded-md shadow-[0_8px_24px_rgb(15_23_42_/_0.06)] dark:shadow-[0_10px_30px_rgb(0_0_0_/_0.28)]',
      'border border-lm-border dark:border-dm-border bg-lm-primary dark:bg-dm-primary',
      'transition-[background-color,border-color,box-shadow] duration-[160ms]',
      className,
    )}
    {...props}
  />
);

BaseCard.displayName = 'Card';

export const Card = Object.assign(BaseCard, { Body, Header, Footer });
