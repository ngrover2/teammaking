import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import DisplayPickedFile from '../DisplayPickedFile'
import {useLocation} from 'react-use';


it('renders correctly', () => {
  const tree = renderer.create(
    <DisplayPickedFile/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});