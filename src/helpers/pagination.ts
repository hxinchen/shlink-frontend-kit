import { formatNumber } from './numbers';

const DELTA = 2;

export const ELLIPSIS = '...';

type Ellipsis = typeof ELLIPSIS;

export type NumberOrEllipsis = number | Ellipsis;

const range = (from: number, to: number): number[] => Array.from({ length: to - from }, (_, i) => from + i);

export const progressivePagination = (currentPage: number, pageCount: number, delta = DELTA): NumberOrEllipsis[] => {
  // First and last pages are always added at the end, so the range only covers pages in between
  const pages: NumberOrEllipsis[] = range(
    Math.max(2, currentPage - delta),
    Math.min(pageCount - 1, currentPage + delta) + 1,
  );

  if (currentPage - delta > 2) {
    pages.unshift(ELLIPSIS);
  }
  if (currentPage + delta < pageCount - 1) {
    pages.push(ELLIPSIS);
  }

  pages.unshift(1);
  pages.push(pageCount);

  return pages;
};

export const pageIsEllipsis = (pageNumber: NumberOrEllipsis): pageNumber is Ellipsis => pageNumber === ELLIPSIS;

export const prettifyPageNumber = (pageNumber: NumberOrEllipsis): string =>
  pageIsEllipsis(pageNumber) ? pageNumber : formatNumber(pageNumber);

export const keyForPage = (pageNumber: NumberOrEllipsis, index: number) =>
  !pageIsEllipsis(pageNumber) ? `${pageNumber}` : `${pageNumber}_${index}`;
