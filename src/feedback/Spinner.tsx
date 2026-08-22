import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { t } from '../i18n';

export type SpinnerProps = {
  /** Accessible label announced to assistive technology */
  label?: string;
  className?: string;
};

/**
 * A spinning icon communicating an ongoing operation, with an accessible label.
 *
 * Size it through the text size utilities of the surrounding context (the icon scales with the
 * font size), e.g. `<Spinner className="text-xl" />`.
 */
export const Spinner: FC<SpinnerProps> = ({ label = t('Loading...'), className }) => (
  <span role="status" className={clsx('inline-block', className)}>
    <FontAwesomeIcon icon={faCircleNotch} spin />
    <span className="sr-only">{label}</span>
  </span>
);
