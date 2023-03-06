import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import renderer from 'react-test-renderer';
import EventList from '../pages/EventList'
import { getAllEvents } from '../services/api';

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

test('matches snapshot', async () => {
  const tree = await renderer.create(<EventList/>).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders proper event data', async () => {
  render(<EventList />);

  let eventData = [];

  getAllEvents().then((res) => {
    eventData = res.data.data;
  });

  eventData.forEach((event) => {
    expect(screen.getByText(event.event.title)).toBeInTheDocument();
  });
});