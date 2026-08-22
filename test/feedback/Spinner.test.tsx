import type { SpinnerProps } from '../../src';
import { Spinner } from '../../src';
import { checkAccessibility } from '../__helpers__/accessibility';
import { render } from '../__helpers__/setUpTest';

describe('<Spinner />', () => {
  const setUp = (props: Partial<SpinnerProps> = {}) => render(<Spinner {...props} />);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    {},
    { label: 'Importing servers' },
    { className: 'text-xl' },
    { label: 'Custom label', className: 'text-lg' },
    { children: 'Importing servers' },
  ])('renders as expected based on provided props', async (props) => {
    const { container } = await setUp(props);
    expect(container).toMatchSnapshot();
  });

  it('announces its purpose to assistive technology', async () => {
    const { getByRole, getByText } = await setUp();

    await expect.element(getByRole('status')).toBeInTheDocument();
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('uses the provided label for assistive technology', async () => {
    const { getByText } = await setUp({ label: 'Importing servers' });

    expect(getByText('Importing servers')).toBeInTheDocument();
  });
});
