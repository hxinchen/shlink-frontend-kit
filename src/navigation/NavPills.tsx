import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import type { LinkProps } from 'react-router';
import { NavLink } from 'react-router';
import { Card } from '../surfaces';

const NavPillsContext = createContext<{ fill?: boolean } | null>(null);

export type PillProps = LinkProps;

const Pill: FC<PillProps> = ({ className, to, ...rest }) => {
  const context = useContext(NavPillsContext);

  return (
    <NavLink
      role="menuitem"
      to={to}
      className={({ isActive }) =>
        clsx(
          'px-4 py-2.5 border-b-2 shrink-0 whitespace-nowrap',
          'highlight:text-lm-brand dark:highlight:text-dm-brand',
          'font-medium text-center no-underline transition-colors duration-[160ms]',
          'rounded-none outline-none focus-visible:inset-ring-2',
          'focus-visible:inset-ring-lm-brand/50 dark:focus-visible:inset-ring-dm-brand/50',
          {
            'text-lm-brand dark:text-dm-brand': isActive,
            'border-b-lm-brand dark:border-b-dm-brand active': isActive,
            'border-b-transparent text-gray-500': !isActive,
            'flex-grow': context?.fill,
          },
          className,
        )
      }
      {...rest}
    />
  );
};

Pill.displayName = 'NavPills.Pill';

export type NavPillsProps = PropsWithChildren<{
  fill?: boolean;
  className?: string;
}>;

/**
 * Tab-like navigation bar wrapping react-router `NavLink`s
 */
const BaseNavPills: FC<NavPillsProps> = ({ children, className, fill }) => (
  <NavPillsContext.Provider value={{ fill }}>
    {/* Scrollable on small screens, so that a large amount of pills does not force them to shrink into
        unreadable multi-line labels. The scrollbar is hidden, as the affordance is the cut-off pill itself. */}
    <Card
      role="menubar"
      className={clsx(
        'flex overflow-x-auto md:overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {children}
    </Card>
  </NavPillsContext.Provider>
);

BaseNavPills.displayName = 'NavPills';

export const NavPills = Object.assign(BaseNavPills, { Pill });
