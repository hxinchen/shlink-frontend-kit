import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { FC, HTMLProps } from 'react';
import { useEffect, useId } from 'react';
import type { LinkProps } from 'react-router';
import { Link, useLocation } from 'react-router';
import { useToggle } from '..';
import { Button } from '../form';
import { t } from '../i18n';
import type { RequiredReactNode } from '../types';
import type { DropdownProps } from './Dropdown';
import { Dropdown as BaseDropdown } from './Dropdown';

type ItemProps = {
  active?: boolean;
};

const MenuItem: FC<LinkProps & ItemProps> = ({ className, active, ...props }) => (
  <li role="menuitem" className="w-full md:w-auto flex" data-active={active}>
    <Link
      className={clsx(
        'px-2 py-3',
        'max-md:w-full max-md:px-3 max-md:py-2',
        'text-lm-text dark:text-dm-text no-underline whitespace-nowrap highlight:opacity-100 transition-[opacity,color] duration-[160ms] relative',
        {
          'opacity-65': !active,
          'opacity-100 text-lm-brand dark:text-dm-brand font-medium': active,
          'after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-lm-brand dark:after:bg-dm-brand': active,
        },
        className,
      )}
      {...props}
    />
  </li>
);

MenuItem.displayName = 'NavBar.MenuItem';

const Dropdown: FC<Omit<DropdownProps, 'menuAlignment' | 'buttonVariant' | 'menuOffset'> & ItemProps> = ({
  containerClassName,
  buttonClassName,
  menuClassName,
  active,
  ...props
}) => {
  return (
    <li role="menuitem" aria-haspopup className="w-full md:w-auto flex" data-active={active}>
      <BaseDropdown
        containerClassName={clsx('max-md:w-full', containerClassName)}
        buttonVariant="text"
        buttonClassName={clsx(
          'px-2 py-3',
          'max-md:w-full max-md:px-3 max-md:py-2',
          'text-lm-text dark:text-dm-text whitespace-nowrap highlight:opacity-100 transition-[opacity,color] duration-[160ms] relative',
          {
            'opacity-65': !active,
            'opacity-100 text-lm-brand dark:text-dm-brand font-medium': active,
          },
          buttonClassName,
        )}
        menuAlignment="right"
        menuOffset={-3}
        menuClassName={clsx('mx-2', menuClassName)}
        {...props}
      />
    </li>
  );
};

Dropdown.displayName = 'NavBar.Dropdown';

export type NavBarProps = HTMLProps<HTMLElement> & {
  brand: RequiredReactNode;
};

export const BaseNavBar: FC<NavBarProps> = ({ className, brand, children }) => {
  const { flag: menuOpen, toggle: toggleMenu, setToFalse: closeMenu } = useToggle();
  const menuId = useId();
  const toggleButtonId = useId();

  // In mobile devices, collapse the navbar when the pathname changes
  const { pathname } = useLocation();
  useEffect(() => closeMenu(), [pathname, closeMenu]);

  return (
    <nav
      className={clsx(
        'w-full relative',
        'bg-lm-main dark:bg-dm-main border-b border-lm-border dark:border-white/10',
        'flex max-md:flex-col items-center justify-between',
        className,
      )}
    >
      <div className="w-full md:w-auto md:flex-1 relative">
        <h4
          className={clsx(
            'text-lm-text dark:text-dm-text px-4 py-3',
            'max-md:w-full max-md:flex max-md:flex-col items-center',
          )}
        >
          {brand}
        </h4>
        <Button
          id={toggleButtonId}
          variant="secondary"
          className={clsx(
            'absolute right-0 top-[50%] translate-y-[-50%]',
            'md:hidden mx-2 [&]:px-2',
            'opacity-60 highlight:opacity-100 transition-opacity duration-[160ms]',
            '[&]:text-lm-text dark:[&]:text-dm-text',
          )}
          onClick={toggleMenu}
          aria-label={menuOpen ? t('Hide menu') : t('Show menu')}
          aria-controls={menuId}
        >
          <FontAwesomeIcon icon={menuOpen ? faChevronUp : faChevronDown} />
        </Button>
      </div>
      <ul
        id={menuId}
        aria-labelledby={toggleButtonId}
        role="menu"
        className={clsx(
          'm-0 p-0',
          'max-md:w-full md:mr-2 max-md:absolute max-md:top-full z-2000',
          'flex max-md:flex-col items-center',
          'bg-lm-main dark:bg-dm-main',
          { 'max-md:hidden': !menuOpen },
        )}
      >
        {children}
      </ul>
    </nav>
  );
};

BaseNavBar.displayName = 'NavBar';

export const NavBar = Object.assign(BaseNavBar, { MenuItem, Dropdown });
