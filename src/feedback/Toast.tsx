import { faCircleCheck, faCircleInfo, faCircleXmark, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CloseButton } from '../form';
import { useTimeout } from '../hooks';
import { t } from '../i18n';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export type ToastOptions = {
  /** Time in ms before the toast is automatically dismissed. Defaults to 5000 */
  timeout?: number;
};

export type Toast = {
  id: number;
  variant: ToastVariant;
  content: ReactNode;
  timeout?: number;
};

export type ToastHelpers = {
  /** Adds a toast with an explicit variant */
  addToast: (variant: ToastVariant, content: ReactNode, options?: ToastOptions) => void;
  success: (content: ReactNode, options?: ToastOptions) => void;
  error: (content: ReactNode, options?: ToastOptions) => void;
  warning: (content: ReactNode, options?: ToastOptions) => void;
  info: (content: ReactNode, options?: ToastOptions) => void;
  /** Dismisses a toast which is currently displayed */
  dismiss: (toast: Toast) => void;
};

const DEFAULT_TOAST_TIMEOUT = 5000;

const ToastContext = createContext<ToastHelpers | undefined>(undefined);

/**
 * Hook used to show transient notifications. Requires a ToastProvider ancestor.
 */
export const useToast = (): ToastHelpers => {
  const helpers = useContext(ToastContext);
  if (!helpers) {
    throw new Error('You cannot use "useToast" outside a ToastProvider');
  }

  return helpers;
};

const ToastItem: FC<{ toast: Toast; onDismiss: (toast: Toast) => void }> = ({ toast, onDismiss }) => {
  const { setTimeout: scheduleDismiss } = useTimeout(toast.timeout ?? DEFAULT_TOAST_TIMEOUT);

  useEffect(() => {
    scheduleDismiss(() => onDismiss(toast));
  }, [onDismiss, scheduleDismiss, toast]);

  return (
    <div
      role="status"
      className={clsx(
        'flex items-center gap-x-2 rounded-md border shadow-md',
        'border-lm-border dark:border-dm-border bg-lm-primary dark:bg-dm-primary',
        'px-3 py-2',
      )}
    >
      <span
        className={clsx({
          'text-success': toast.variant === 'success',
          'text-danger': toast.variant === 'error',
          'text-warning': toast.variant === 'warning',
          'text-lm-brand dark:text-dm-brand': toast.variant === 'info',
        })}
      >
        <FontAwesomeIcon
          icon={
            {
              success: faCircleCheck,
              error: faCircleXmark,
              warning: faTriangleExclamation,
              info: faCircleInfo,
            }[toast.variant]
          }
        />
      </span>
      <div className="text-sm">{toast.content}</div>
      <CloseButton onClick={() => onDismiss(toast)} label={t('Dismiss notification')} />
    </div>
  );
};

/**
 * Provides the toast context and renders the stack of active toasts, fixed at the bottom-right
 * corner of the viewport.
 */
export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastId = useRef(0);

  const addToast = useCallback<ToastHelpers['addToast']>((variant, content, { timeout } = {}) => {
    lastId.current += 1;
    setToasts((prevToasts) => [...prevToasts, { id: lastId.current, variant, content, timeout }]);
  }, []);

  const dismiss = useCallback((toast: Toast) => {
    setToasts((prevToasts) => prevToasts.filter((currentToast) => currentToast !== toast));
  }, []);

  const helpers = useMemo<ToastHelpers>(
    () => ({
      addToast,
      dismiss,
      success: (content, options) => addToast('success', content, options),
      error: (content, options) => addToast('error', content, options),
      warning: (content, options) => addToast('warning', content, options),
      info: (content, options) => addToast('info', content, options),
    }),
    [addToast, dismiss],
  );

  return (
    <ToastContext.Provider value={helpers}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-2500 flex flex-col gap-2 items-end">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
