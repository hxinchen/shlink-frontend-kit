import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import { t } from '../i18n';

export type SpinnerProps = PropsWithChildren<{
  /**
   * Accessible label announced to assistive technology when no visible children are provided.
   * Ignored when children are rendered next to the icon, as they act as the label then.
   */
  label?: string;
  className?: string;
}>;

/**
 * A spinning icon communicating an ongoing operation, announced through role=status.
 *
 * Pass children to render a visible label next to the icon; otherwise the `label` is rendered
 * for assistive technology only. Size it through the text size utilities of the surrounding
 * context (the icon scales with the font size), e.g. `<Spinner className="text-xl" />`.
 */
export const Spinner: FC<SpinnerProps> = ({ label = t('Loading...'), className, children }) => (
  <span
    role="status"
    className={clsx(children ? 'flex items-center gap-2' : 'inline-block', className)}
  >
    <FontAwesomeIcon icon={faCircleNotch} spin />
    {children ?? <span className="sr-only">{label}</span>}
  </span>
);
