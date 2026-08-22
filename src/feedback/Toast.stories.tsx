import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../form/Button';
import { ToastProvider, useToast } from './Toast';

const Trigger = () => {
  const toast = useToast();

  return (
    <div className="flex gap-x-2">
      <Button onClick={() => toast.success('Changes saved')}>Success</Button>
      <Button onClick={() => toast.error('Something went wrong')}>Error</Button>
      <Button onClick={() => toast.warning('This server is almost out of visits')}>Warning</Button>
      <Button onClick={() => toast.info('New version available')}>Info</Button>
      <Button onClick={() => toast.addToast('info', 'I will stay here', { timeout: 60_000 })}>Sticky</Button>
    </div>
  );
};

const meta = {
  component: ToastProvider,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <Trigger />,
};
