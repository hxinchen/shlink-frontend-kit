import {
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import type { OpenChangeReason } from '@floating-ui/react';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { RequiredReactNode, Size } from '../types';
import { Menu } from './Menu';

export type DropdownProps = PropsWithChildren<{
  buttonContent: RequiredReactNode;
  buttonSize?: Size;
  buttonClassName?: string;
  buttonVariant?: 'button' | 'link' | 'text';
  buttonDisabled?: boolean;

  /** Set as the button's `aria-label` attribute */
  buttonLabel?: string;
  /** Classes to be set on the containing wrapper element */
  containerClassName?: string;
  /** Classes to be set on the menu element */
  menuClassName?: string;

  /**
   * Controls how the floating menu is sized. Defaults to `reference`, which makes it at least as wide as the toggle
   * button, growing if its items need more room. Use `content` to size it purely based on its items.
   */
  menuWidth?: 'reference' | 'content';

  /**
   * Whether the menu should align with the right or the left side of the toggle button in case it is bigger.
   * Defaults to 'left'.
   */
  menuAlignment?: 'left' | 'right';

  /** Distance between toggle button and menu when open, in pixels. Defaults to 3 */
  menuOffset?: number;
  /** Whether to hide the caret or not. Defaults to false */
  caretless?: boolean;
}>;

const BaseDropdown: FC<DropdownProps> = ({
  children,
  menuAlignment = 'left',
  buttonVariant = 'button',
  buttonContent,
  buttonClassName,
  buttonSize = 'md',
  buttonDisabled = false,
  containerClassName,
  menuClassName,
  menuWidth = 'reference',
  caretless,
  buttonLabel,
  menuOffset = 3,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeDropdown = useCallback(({ focusButton = true }: { focusButton?: boolean } = {}) => {
    setIsOpen(false);
    // Return focus to dropdown after closing it
    if (focusButton) {
      buttonRef.current?.focus();
    }
  }, []);
  const handleOpenChange = useCallback((open: boolean, _event?: Event, reason?: OpenChangeReason) => {
    setIsOpen(open);
    // Return focus to the toggle when dismissed via keyboard or outside press, matching the
    // behavior of the previous hand-rolled implementation. Deferred because the dismissing
    // pointer event moves focus to its target after the close has already been handled
    if (!open && (reason === 'escape-key' || reason === 'outside-press')) {
      window.setTimeout(() => buttonRef.current?.focus(), 0);
    }
  }, []);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: handleOpenChange,
    placement: menuAlignment === 'right' ? 'bottom-end' : 'bottom-start',
    middleware: [
      offset(menuOffset),
      flip(),
      // Shift along both axes, so that the menu stays inside the viewport. Horizontally, this matters on small screens,
      // where toggles sit close to the edges and menus can be wider than their toggle
      shift({ crossAxis: true, padding: 8 }),
      ...(menuWidth === 'reference'
        ? [
            // Inside a portal, `min-width: 100%` would resolve against the body instead of the
            // container, widening the menu past the toggle button and covering neighboring content.
            // Use the reference width as the minimum width instead, which is what the previous non-portaled
            // implementation rendered: never narrower than the toggle, but able to grow to fit its items.
            size({
              apply({ rects, elements }) {
                elements.floating.style.minWidth = `${rects.reference.width}px`;
              },
            }),
          ]
        : []),
    ],
    // The menu is rendered through a FloatingPortal, so it needs fixed positioning to escape
    // any ancestor with transform or overflow rules
    strategy: 'fixed',
    // oxlint-disable-next-line react-compiler/react-compiler
    elements: { reference: buttonRef.current },
  });
  const click = useClick(context);
  // Handles closing on outside click and Escape key, and is aware of the menu being portaled out
  // of the container element
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);
  const menuId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  // Render the portal host right after the container instead of at the end of the body, so that
  // the portaled menu keeps its natural position in the tab order
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);
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

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const controller = new AbortController();

    // Close the menu when focus moves out of it. The listener is document-level because the menu
    // is rendered through a portal, so focus events in it do not bubble through the container
    document.body.addEventListener(
      'focusout',
      ({ relatedTarget }) => {
        const target = relatedTarget instanceof HTMLElement ? relatedTarget : null;
        // NOTE both containers must be checked with ||: contains() returns false (not nullish)
        // for elements outside the container
        const isWithinDropdown =
          !!target &&
          ((containerRef.current?.contains(target) ?? false) || (floatingRef.current?.contains(target) ?? false));
        if (target && !isWithinDropdown) {
          closeDropdown({ focusButton: false });
        }
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [closeDropdown, isOpen]);

  return (
    <div ref={containerRef} className={clsx('relative inline-block', containerClassName)}>
      <button
        ref={buttonRef}
        {...getReferenceProps()}
        type="button"
        aria-haspopup
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={buttonLabel}
        disabled={buttonDisabled}
        className={clsx(
          'flex items-center rounded-md focus-ring transition-[background-color,border-color,color,box-shadow] duration-[160ms]',
          {
            'justify-between': !caretless,
            'cursor-pointer': !buttonDisabled,
            'pointer-events-none opacity-50': buttonDisabled,

            // Button variant
            'border border-lm-border dark:border-dm-border': buttonVariant === 'button',
            'bg-lm-primary dark:bg-dm-primary': buttonVariant === 'button',
            // Use different bg color when inside a card
            'group-[&]/card:bg-lm-input group-[&]/card:dark:bg-dm-input': buttonVariant === 'button',

            // Link variant
            'text-lm-brand dark:text-dm-brand': buttonVariant === 'link',
            'highlight:text-lm-brand-dark dark:highlight:text-dm-brand-dark highlight:underline':
              buttonVariant === 'link',

            // Button sizes
            'px-1.5 py-1 text-sm': buttonVariant !== 'text' && buttonSize === 'sm',
            'px-3.5 py-2': buttonVariant !== 'text' && buttonSize === 'md',
            'px-4 py-2.5 text-base': buttonVariant !== 'text' && buttonSize === 'lg',
            'gap-x-1.5': buttonSize === 'sm',
            'gap-x-2': buttonSize !== 'sm',
          },
          buttonClassName,
        )}
        onKeyDown={(e) => {
          // Open dropdown when pressing ArrowDown
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {buttonContent}
        {!caretless && <FontAwesomeIcon icon={faCaretDown} size="xs" widthAuto />}
      </button>
      {isOpen && portalRoot && (
        <FloatingPortal root={portalRoot}>
          <div
            ref={(node) => {
              refs.setFloating(node);
              floatingRef.current = node;
            }}
            style={floatingStyles}
            className="z-1500"
            {...getFloatingProps()}
          >
            <Menu
              className={menuClassName}
              id={menuId}
              focusableElementsSelector={
                '[role="menuitem"]:not([disabled]):not([aria-disabled]),input:not([disabled]),select:not([disabled])'
              }
              focusFirstItem
              onItemClick={closeDropdown}
            >
              {children}
            </Menu>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};

BaseDropdown.displayName = 'Dropdown';

export const Dropdown = Object.assign(BaseDropdown, {
  Item: Menu.Item,
  Separator: Menu.Separator,
  Title: Menu.Title,
  Misc: Menu.Misc,
});
