import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import renderer from 'react-test-renderer';
import EventList from '../pages/EventList'
import getEventData from '../services/getEventData';

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

test('matches snapshot', () => {
  const tree = renderer.create(<EventList/>).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders proper event data', () => {
  render(<EventList />);

  const eventData = getEventData().events;
  eventData.forEach((event) => {
    expect(screen.getByText(event.event.title)).toBeInTheDocument();
  });
});
