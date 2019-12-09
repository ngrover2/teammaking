import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import {useLocation} from 'react-use';
import DisplaySavedRosterComponent from '../Roster/DisplaySavedRosterComponent.js';


it('renders correctly', () => {
  const tree = renderer.create(
    <DisplaySavedRosterComponent/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});