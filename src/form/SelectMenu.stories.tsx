import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SelectMenu } from './SelectMenu';

const meta = {
  component: SelectMenu,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof SelectMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

const languageOptions = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en', label: 'English' },
];

const Interactive = ({ placeholder }: { placeholder?: string }) => {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <SelectMenu
      aria-label="Language"
      placeholder={placeholder}
      options={languageOptions}
      value={value}
      onChange={setValue}
    />
  );
};

export const Default: Story = {
  args: {
    options: languageOptions,
    onChange: () => {},
  },
  render: () => <Interactive />,
};

export const WithPlaceholder: Story = {
  args: {
    options: languageOptions,
    onChange: () => {},
  },
  render: () => <Interactive placeholder="Select a language…" />,
};
