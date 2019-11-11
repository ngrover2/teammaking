import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import MainAppComponent from '../MainAppComponent'

it('renders correctly', () => {
  const tree = renderer.create(
    <MainAppComponent></MainAppComponent>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});