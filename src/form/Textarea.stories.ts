import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  component: Textarea,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Write something',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small textarea',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large textarea',
  },
};

export const WithError: Story = {
  args: {
    feedback: 'error',
    placeholder: 'Errored textarea',
  },
};

export const Tall: Story = {
  args: {
    rows: 6,
    placeholder: 'A six-row textarea',
  },
};
