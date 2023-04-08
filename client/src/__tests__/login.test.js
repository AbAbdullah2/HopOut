import '@testing-library/jest-dom'
import {render, screen, fireEvent} from '@testing-library/react'
import renderer from 'react-test-renderer';
import Login from '../pages/Login'

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


// test('matches snapshot', async () => {
//   const data = {email: "jhop@jhu.edu", password: "password!"};
//   const tree = await renderer.create(<Login data={data}/>).toJSON();
//   expect(tree).toMatchSnapshot();
// });

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

test('Clickable login button', async () => {    
  render(<Login />);

  const emailInput = screen.getByLabelText('Email address');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByRole('button', { name: 'Login' });

  fireEvent.change(emailInput, { target: { value: 'jdcruz1@jhu.edu' } });
  fireEvent.change(passwordInput, { target: { value: 'johndcruz' } });
  try {
    fireEvent.click(loginButton);
  } catch (error) {
    console.log(error);
  }
});
