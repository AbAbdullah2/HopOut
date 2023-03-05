import '@testing-library/jest-dom'
import {render, screen, fireEvent} from '@testing-library/react'
import renderer from 'react-test-renderer';
import CreateAccount from '../pages/CreateAccount'

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test('renders login fields', () => {
  render(<CreateAccount />);

  const emailInput = screen.getByLabelText('Email');
  const nameInput = screen.getByLabelText('Name');
  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm password');
  const signupButton = screen.getByRole('button', { name: 'Create account' });

  expect(emailInput).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(signupButton).toBeInTheDocument();
});

test('password alerts', () => {    
  render(<CreateAccount />);

  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm password');
  const signupButton = screen.getByRole('button', { name: 'Create account' });

  fireEvent.change(passwordInput, { target: { value: '123' } });
  expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
  expect(screen.getByText('Passwords must match.')).toBeInTheDocument();

  fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
  fireEvent.click(signupButton);
});


test('matches snapshot', () => {
  const tree = renderer.create(<CreateAccount/>).toJSON();
  expect(tree).toMatchSnapshot();
})