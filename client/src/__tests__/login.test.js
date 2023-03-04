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

import '@testing-library/jest-dom'
import {render, screen, cleanup, fireEvent} from '@testing-library/react'
import renderer from 'react-test-renderer';
import Login from '../pages/Login'


test('renders login fields', () => {
  render(<Login />);

  const emailInput = screen.getByLabelText('Email address');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByRole('button', { name: 'Login' });
  const signupButton = screen.getByRole('button', { name: 'Sign Up' });

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  expect(signupButton).toBeInTheDocument();
});

test('Clickable buttons', () => {    
  render(<Login />);

  const emailInput = screen.getByLabelText('Email address');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByRole('button', { name: 'Login' });
  const signupButton = screen.getByRole('button', { name: 'Sign Up' });

  fireEvent.change(emailInput, { target: { value: '' } });
  fireEvent.change(passwordInput, { target: { value: '' } });
  fireEvent.click(loginButton);
  fireEvent.click(signupButton);
});


test('matches snapshot', () => {
  const data = {email: "jhop@jhu.edu", password: "password!"};
  const tree = renderer.create(<Login data={data}/>).toJSON();
  expect(tree).toMatchSnapshot();
})