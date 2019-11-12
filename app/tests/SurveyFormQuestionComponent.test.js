import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import SurveyFormQuestionComponent from '..\Survey\SurveyFormQuestionComponent.js'
import {useLocation} from 'react-use';


it('renders correctly', () => {
  const tree = renderer.create(
    <SurveyFormQuestionComponent/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});