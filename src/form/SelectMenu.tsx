import {
  flip,
  FloatingPortal,
  offset,
  size as sizeMiddleware,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { FC, HTMLProps, ReactNode, RefObject } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useArrowKeyNavigation } from '../hooks';
import { t } from '../i18n';
import type { Size } from '../types';

export type SelectMenuOption = {
  value: string;
  label: ReactNode;
};

export type SelectMenuProps = Omit<
  HTMLProps<HTMLButtonElement>,
  'onChange' | 'children' | 'size' | 'value' | 'type'
> & {
  options: SelectMenuOption[];

  /** Currently selected value */
  value?: string;

  /** Called with the option value whenever an option is picked */
  onChange: (value: string) => void;

  /** Text rendered in the toggle when no value is selected */
  placeholder?: string;
  size?: Size;
  disabled?: boolean;

  /** Classes for the floating menu */
  menuClassName?: string;
};

const buttonSizeClasses = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-1.5',
  lg: 'px-4 py-2 text-lg',
} as const;

type SelectMenuListProps = {
  menuId: string;
  ariaLabel?: string;
  options: SelectMenuOption[];
  value?: string;
  menuRef: RefObject<HTMLDivElement | null>;
  menuClassName?: string;
  onPick: (value: string) => void;
};

const SelectMenuList: FC<SelectMenuListProps> = ({
  menuId,
  ariaLabel,
  options,
  value,
  menuRef,
  menuClassName,
  onPick,
}) => {
  // Mounted together with the menu, so the hook sees a non-null container ref right away and
  // can take over arrow-key navigation and initial focus
  useArrowKeyNavigation(menuRef, {
    elementsSelector: '[role="option"]',
    focusFirstItem: true,
    vertical: true,
    horizontal: false,
  });

  return (
    <div
      ref={menuRef}
      id={menuId}
      role="listbox"
      aria-label={ariaLabel}
      className={clsx(
        'flex flex-col rounded-md border py-1 max-h-72 overflow-y-auto scroll-thin',
        'border-lm-border dark:border-dm-border bg-lm-primary dark:bg-dm-primary',
        'shadow-[0_4px_16px_rgb(15_23_42_/_0.12)] dark:shadow-[0_4px_16px_rgb(0_0_0_/_0.5)]',
        menuClassName,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            data-selected={isSelected}
            onClick={() => onPick(option.value)}
            className={clsx(
              'flex items-center justify-between gap-x-3 text-start px-3 py-1.5 cursor-pointer no-underline',
              'text-inherit highlight:bg-lm-secondary dark:highlight:bg-dm-active transition-colors duration-[100ms]',
              isSelected && 'font-medium text-lm-brand dark:text-dm-brand',
            )}
          >
            <span className="truncate">{option.label}</span>
            {isSelected && <FontAwesomeIcon icon={faCheck} className="text-xs shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};

/**
 * A styled select with a floating menu, keyboard navigation and check marks on options.
 *
 * Acts as the unified selector across the app: same look and behavior wherever a choice has to
 * be made from a short list of options.
 */
export const SelectMenu: FC<SelectMenuProps> = ({
  options,
  value,
  onChange,
  placeholder,
  size = 'md',
  disabled = false,
  className,
  menuClassName,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);
  const menuId = useId();

  const closeMenu = useCallback(({ focusButton = true }: { focusButton?: boolean } = {}) => {
    setIsOpen(false);
    if (focusButton) {
      buttonRef.current?.focus();
    }
  }, []);

  // Insert the portal host right after the container so the portaled menu keeps its natural
  // position in the tab order
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const host = document.createElement('div');
    container.after(host);
    setPortalRoot(host);

    return () => host.remove();
  }, []);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [
      flip(),
      offset(4),
      sizeMiddleware({
        apply({ elements, rects }) {
          elements.floating.style.minWidth = `${Math.max(rects.reference.width, 180)}px`;
        },
      }),
    ],
    // The menu is rendered through a FloatingPortal, so it needs fixed positioning to escape
    // any ancestor with transform or overflow rules
    strategy: 'fixed',
  });
  const click = useClick(context);
  // Handles closing on outside click and Escape key, and is aware of the menu being portaled
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={containerRef} className="inline-flex">
      <button
        ref={(node) => {
          buttonRef.current = node;
          refs.setReference(node);
        }}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        disabled={disabled}
        className={clsx(
          'flex min-h-9 items-center justify-between gap-x-2 rounded-md border cursor-pointer text-start',
          'border-lm-input-border dark:border-dm-input-border',
          'bg-lm-primary dark:bg-dm-primary group-[&]/card:bg-lm-input group-[&]/card:dark:bg-dm-input',
          'text-lm-text dark:text-dm-text focus-ring transition-colors duration-[160ms]',
          'disabled:opacity-50 disabled:pointer-events-none',
          buttonSizeClasses[size],
          className,
        )}
        {...getReferenceProps()}
        {...rest}
      >
        <span className={clsx('truncate', !selected && 'text-placeholder')}>
          {selected?.label ?? placeholder ?? t('Select...')}
        </span>
        <FontAwesomeIcon icon={faChevronDown} size="xs" className="text-placeholder shrink-0" />
      </button>
      {isOpen && portalRoot && (
        <FloatingPortal root={portalRoot}>
          {/* oxlint-disable-next-line react/react-compiler */}
          <div ref={refs.setFloating} style={floatingStyles} className="z-1500" {...getFloatingProps()}>
            <SelectMenuList
              menuId={menuId}
              ariaLabel={ariaLabel}
              options={options}
              value={value}
              menuRef={menuRef}
              menuClassName={menuClassName}
              onPick={(pickedValue) => {
                onChange(pickedValue);
                closeMenu();
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};
