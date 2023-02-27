  import React from 'react';
import renderer from 'react-test-renderer';
import Login from '../pages/Login';
import Todos from './Todos';
 
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
  
it("renders correctly when there are no todos", () => {
 const tree = renderer.create(<Login />).toJSON();
//  expect(tree).toMatchSnapshot();
    console.log('tree: ', tree)
    console.log('tree: ', tree)
});

