import '@testing-library/jest-dom'
import {render, screen, fireEvent} from '@testing-library/react'
import renderer from 'react-test-renderer';
import CreateEvent from '../pages/CreateEvent'

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

test('renders correct form fields', () => {
  render(<CreateEvent />);

  const titleInput = screen.getByLabelText('Title');
  const startInput = screen.getByLabelText('Start Date/Time');
  const endInput = screen.getByLabelText('End Date/Time');
  const descriptionInput = screen.getByLabelText('Description');
  const locationInput = screen.getByLabelText('Location');
  const coverInput = screen.getByLabelText('Cover photo');
  const thumbnailInput = screen.getByLabelText('Thumbnail');
  const addButton = screen.getByRole('button', { name: 'Add Event' });

  expect(titleInput).toBeInTheDocument();
  expect(startInput).toBeInTheDocument();
  expect(endInput).toBeInTheDocument();
  expect(descriptionInput).toBeInTheDocument();
  expect(locationInput).toBeInTheDocument();
  expect(coverInput).toBeInTheDocument();
  expect(thumbnailInput).toBeInTheDocument();
  expect(addButton).toBeInTheDocument();
});

test('cover upload works properly', () => {    
  render(<CreateEvent />);

  const coverInput = screen.getByLabelText('Cover photo');
  //const addButton = screen.getByRole('button', { name: 'Add Event' });
  const testCover = new File(['(⌐□_□)'], 'chucknorris_cover.png', { type: 'image/png' });

  fireEvent.change(coverInput, { target: { files: [testCover] } });
  expect(screen.getByText('chucknorris_cover.png')).toBeInTheDocument();
});

test('thumbnail upload works properly', () => {    
  render(<CreateEvent />);

  const thumbnailInput = screen.getByLabelText('Thumbnail');
  //const addButton = screen.getByRole('button', { name: 'Add Event' });
  const testThumbnail = new File(['(⌐□_□)'], 'chucknorris_thumbnail.png', { type: 'image/png' });

  fireEvent.change(thumbnailInput, { target: { files: [testThumbnail] } });
  expect(screen.getByText('chucknorris_thumbnail.png')).toBeInTheDocument();
});