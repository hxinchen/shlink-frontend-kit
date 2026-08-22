import type { TextareaProps } from '../../src';
import { Textarea } from '../../src';
import { checkAccessibility } from '../__helpers__/accessibility';
import { render } from '../__helpers__/setUpTest';

describe('<Textarea />', () => {
  const setUp = (props: Partial<TextareaProps> = {}) => render(<Textarea placeholder="Write something" {...props} />);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    {},
    { size: 'sm' as const },
    { size: 'md' as const },
    { size: 'lg' as const },
    { feedback: 'error' as const },
    { disabled: true },
    { variant: 'unstyled' as const },
    { rows: 6 },
  ])('renders as expected based on provided props', async (props) => {
    const { container } = await setUp(props);
    expect(container).toMatchSnapshot();
  });

  it('defaults to three rows', async () => {
    const { container } = await setUp();
    expect(container.querySelector('textarea')).toHaveAttribute('rows', '3');
  });
});
