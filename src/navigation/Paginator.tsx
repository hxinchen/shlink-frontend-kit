import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { FC, HTMLProps, PropsWithChildren } from 'react';
import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import type { NumberOrEllipsis } from '../helpers';
import { ELLIPSIS, keyForPage, pageIsEllipsis, prettifyPageNumber, progressivePagination } from '../helpers';
import { useArrowKeyNavigation } from '../hooks';
import { t } from '../i18n';

/**
 * On narrow screens, only one page is displayed at each side of the current one, as otherwise the paginator can be
 * wider than phone screens
 */
const COMPACT_MEDIA_QUERY = '(max-width: 575.98px)';
const COMPACT_DELTA = 1;

const subscribeToCompactChange = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(COMPACT_MEDIA_QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
};
const isCompact = () => window.matchMedia(COMPACT_MEDIA_QUERY).matches;

const commonClasses = [
  'border border-r-0 last:border-r border-lm-border dark:border-dm-border',
  'rounded-none first:rounded-l last:rounded-r',
];

const buildPaginatorItemClasses = (active = false) =>
  clsx(
    commonClasses,
    'px-2.5 sm:px-3 py-2 cursor-pointer no-underline',
    'focus-ring focus-visible:z-1',
    !active && [
      'text-lm-brand dark:text-dm-brand',
      'bg-lm-primary dark:bg-dm-primary',
      'highlight:bg-lm-secondary dark:highlight:bg-dm-secondary',
    ],
    active && 'bg-lm-brand dark:bg-dm-brand text-white dark:text-dm-main',
  );

const DisabledPaginatorItem: FC<PropsWithChildren> = ({ children }) => (
  <span aria-hidden className={clsx(commonClasses, 'px-2.5 sm:px-3 py-2 text-gray-400')}>
    {children}
  </span>
);

const EllipsisPaginatorItem = () => <DisabledPaginatorItem>{ELLIPSIS}</DisabledPaginatorItem>;

type BasePaginatorItemProps = {
  active?: boolean;
  isEllipsis?: boolean;
};

type PaginatorItemProps<T extends HTMLElement> = PropsWithChildren<
  BasePaginatorItemProps & Omit<HTMLProps<T>, 'className'>
>;

function LinkPaginatorItem({
  children,
  active,
  isEllipsis,
  href,
  ...anchorProps
}: PaginatorItemProps<HTMLAnchorElement>) {
  const classes = useMemo(() => buildPaginatorItemClasses(active), [active]);
  return isEllipsis ? (
    <EllipsisPaginatorItem />
  ) : (
    <Link className={classes} to={href!} {...anchorProps} data-active={active}>
      {children}
    </Link>
  );
}

function ButtonPaginatorItem({
  children,
  active,
  isEllipsis,
  ...buttonProps
}: Omit<PaginatorItemProps<HTMLButtonElement>, 'type'>) {
  const classes = useMemo(() => buildPaginatorItemClasses(active), [active]);
  return isEllipsis ? (
    <EllipsisPaginatorItem />
  ) : (
    <button type="button" className={classes} {...buttonProps} data-active={active}>
      {children}
    </button>
  );
}

export type PaginatorProps = {
  pagesCount: number;
  currentPage: number;
} & (
  | {
      onPageChange: (currentPage: number) => void;
    }
  | {
      urlForPage: (pageNumber: number) => string;
    }
);

export const Paginator: FC<PaginatorProps> = ({ currentPage, pagesCount, ...rest }) => {
  const isLinksPaginator = 'urlForPage' in rest;
  const PaginatorItem = isLinksPaginator ? LinkPaginatorItem : ButtonPaginatorItem;
  const itemPropsForPageNumber = useCallback(
    (pageNumber: NumberOrEllipsis) =>
      isLinksPaginator
        ? { href: pageIsEllipsis(pageNumber) ? undefined : rest.urlForPage(pageNumber) }
        : { onClick: () => !pageIsEllipsis(pageNumber) && rest.onPageChange(pageNumber) },
    [isLinksPaginator, rest],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  useArrowKeyNavigation(containerRef, { elementsSelector: 'button,a', vertical: false });
  const compact = useSyncExternalStore(subscribeToCompactChange, isCompact);

  if (pagesCount < 2) {
    return null;
  }

  return (
    <div className="select-none flex" data-testid="paginator" ref={containerRef}>
      {currentPage === 1 ? (
        <DisabledPaginatorItem>
          <FontAwesomeIcon size="xs" icon={faChevronLeft} />
        </DisabledPaginatorItem>
      ) : (
        <PaginatorItem {...itemPropsForPageNumber(Math.max(1, currentPage - 1))} aria-label={t('Previous')}>
          <FontAwesomeIcon size="xs" icon={faChevronLeft} />
        </PaginatorItem>
      )}
      {progressivePagination(currentPage, pagesCount, compact ? COMPACT_DELTA : undefined).map((pageNumber, index) => (
        <PaginatorItem
          key={keyForPage(pageNumber, index)}
          active={pageNumber === currentPage}
          isEllipsis={pageIsEllipsis(pageNumber)}
          {...itemPropsForPageNumber(pageNumber)}
        >
          {prettifyPageNumber(pageNumber)}
        </PaginatorItem>
      ))}
      {currentPage === pagesCount ? (
        <DisabledPaginatorItem>
          <FontAwesomeIcon size="xs" icon={faChevronRight} />
        </DisabledPaginatorItem>
      ) : (
        <PaginatorItem {...itemPropsForPageNumber(Math.min(pagesCount, currentPage + 1))} aria-label={t('Next')}>
          <FontAwesomeIcon size="xs" icon={faChevronRight} />
        </PaginatorItem>
      )}
    </div>
  );
};
