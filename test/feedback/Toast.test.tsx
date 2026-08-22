import type { FC } from 'react';
import { Button, ToastProvider, useToast } from '../../src';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

const SaveButton: FC<{ timeout?: number }> = ({ timeout }) => {
  const toast = useToast();

  return (
    <Button
      onClick={() => toast.success('Saved successfully', timeout !== undefined ? { timeout } : undefined)}
    >
      Save
    </Button>
  );
};

describe('<ToastProvider />', () => {
  const setUp = (timeout?: number) => renderWithEvents(
    <ToastProvider>
      <SaveButton timeout={timeout} />
    </ToastProvider>,
  );
  const saveToast = async (
    user: Awaited<ReturnType<typeof renderWithEvents>>['user'],
    screen: Omit<Awaited<ReturnType<typeof renderWithEvents>>, 'user'>,
  ) => {
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await expect.element(screen.getByText('Saved successfully')).toBeInTheDocument();
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('shows a toast when requested, and dismisses it after the timeout', async () => {
    const { user, ...screen } = await setUp(100);

    await saveToast(user, screen);

    await expect.element(screen.getByText('Saved successfully')).not.toBeInTheDocument();
  });

  it('keeps a toast displayed while its timeout has not elapsed', async () => {
    const { user, ...screen } = await setUp(10_000);

    await saveToast(user, screen);

    await new Promise((resolve) => setTimeout(resolve, 150));
    await expect.element(screen.getByText('Saved successfully')).toBeInTheDocument();
  });

  it('allows dismissing a toast through its close button', async () => {
    const { user, ...screen } = await setUp(10_000);

    await saveToast(user, screen);

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    await expect.element(screen.getByText('Saved successfully')).not.toBeInTheDocument();
  });

  it('renders one entry per queued toast', async () => {
    const { user, ...screen } = await setUp(10_000);

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await vi.waitFor(() => expect(screen.container.querySelectorAll('[role="status"]')).toHaveLength(3));
  });

  it('exposes one helper per variant', async () => {
    const variants = ['success', 'error', 'warning', 'info'] as const;
    const Triggers = () => (
      <>
        {variants.map((variant) => (
          <VariantButton key={variant} variant={variant} />
        ))}
      </>
    );
    const VariantButton: FC<{ variant: typeof variants[number] }> = ({ variant }) => {
      const toast = useToast();

      return <Button onClick={() => toast[variant](`Toast for ${variant}`)}>{variant}</Button>;
    };
    const { user, ...screen } = await renderWithEvents(
      <ToastProvider>
        <Triggers />
      </ToastProvider>,
    );

    for (const variant of variants) {
      await user.click(screen.getByRole('button', { name: variant }));
      await expect.element(screen.getByText(`Toast for ${variant}`)).toBeInTheDocument();
    }
  });
});
