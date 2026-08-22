import type { BadgeProps } from '../../src';
import { Badge } from '../../src';
import { checkAccessibility } from '../__helpers__/accessibility';
import { render } from '../__helpers__/setUpTest';

describe('<Badge />', () => {
  const setUp = (props: Partial<BadgeProps> = {}) => render(<Badge {...props}>Saved</Badge>);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    {},
    { variant: 'default' as const },
    { variant: 'brand' as const },
    { variant: 'success' as const },
    { variant: 'warning' as const },
    { variant: 'danger' as const },
  ])('renders as expected based on provided props', async (props) => {
    const { container } = await setUp(props);
    expect(container).toMatchSnapshot();
  });
});
