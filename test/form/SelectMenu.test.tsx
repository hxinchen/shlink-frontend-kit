import type { SelectMenuProps } from '../../src';
import { SelectMenu } from '../../src';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<SelectMenu />', () => {
  const options = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'system', label: 'System' },
  ];

  const setUp = async (props: Partial<SelectMenuProps> = {}) => {
    const renderResult = await renderWithEvents(
      <SelectMenu aria-label="Theme" options={options} value="light" onChange={() => {}} {...props} />,
    );

    return {
      ...renderResult,
      toggle: renderResult.getByRole('button', { name: 'Theme' }),
      openMenu: async () => {
        await renderResult.user.click(renderResult.getByRole('button', { name: 'Theme' }));
        await expect.element(renderResult.getByRole('listbox')).toBeInTheDocument();
      },
    };
  };

  const setUpWithOnChange = async () => {
    const onChange = vi.fn();
    const screen = await setUp({ onChange });

    return { onChange, ...screen };
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders the selected option as the toggle label', async () => {
    const { toggle } = await setUp();

    await expect.element(toggle).toHaveTextContent('Light');
  });

  it('renders the placeholder when no value is selected', async () => {
    const { toggle } = await setUp({ value: undefined, placeholder: 'Pick one' });

    await expect.element(toggle).toHaveTextContent('Pick one');
  });

  it('opens the menu on click and marks the selected option', async () => {
    const { openMenu, getByRole } = await setUp();

    await openMenu();

    expect(getByRole('option', { name: 'Light' }).element().getAttribute('aria-selected')).toEqual('true');
    expect(getByRole('option', { name: 'Dark' }).element().getAttribute('aria-selected')).toEqual('false');
  });

  it('invokes onChange and closes the menu when an option is picked', async () => {
    const { onChange, openMenu, getByRole, user } = await setUpWithOnChange();

    await openMenu();
    await user.click(getByRole('option', { name: 'Dark' }));

    expect(onChange).toHaveBeenCalledWith('dark');
    await expect.element(getByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the menu when clicking away without picking', async () => {
    const { onChange, openMenu, getByRole, user, container } = await setUpWithOnChange();

    await openMenu();
    await user.click(container);

    expect(onChange).not.toHaveBeenCalled();
    await expect.element(getByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the menu when pressing Escape', async () => {
    const { openMenu, getByRole, user } = await setUp();

    await openMenu();
    await user.keyboard('{Escape}');

    await expect.element(getByRole('listbox')).not.toBeInTheDocument();
  });

  it('navigates options with arrow keys and selects with Enter', async () => {
    const { onChange, openMenu, user } = await setUpWithOnChange();

    await openMenu();
    // The selected option (light) is focused first; ArrowUp moves to dark
    await user.keyboard('{ArrowUp}');
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('dark');
  });

  it('shows no menu while disabled', async () => {
    const { toggle, getByRole } = await setUp({ disabled: true });

    expect(toggle.element().hasAttribute('disabled')).toBe(true);
    expect(getByRole('listbox').elements()).toHaveLength(0);
  });
});
