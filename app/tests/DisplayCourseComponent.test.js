import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import DisplayCourseComponent from '../DisplayCourseComponent'

var courseDetails = {
  name:"SSDI Fall'19",
  classCode:"ITCS 6112 - 8112",
  proffessorName:"Harini Ramaprasad",
  taName:"Manav Mittal",
  courseStartDate:"August 19, 2019",
  courseEndDate:"December 12, 2019",
  courseDescription:"This course is about teaching software programming principles and Software architecture and design."
}
it('renders correctly', () => {
  const tree = renderer.create(
    <DisplayCourseComponent {...courseDetails}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});