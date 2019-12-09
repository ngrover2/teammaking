{/**/}
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import AnswerSurveyComponent from '../StudentAnswerSurvey/AnswerSurveyComponent.jsx'

var AnswerSurveyComponentDetails = {
    "survey_details":{
        "course_name":"SSDI",
        "course_instructor":"Harini",
        "deadline":1893139865
    },
    "questions":
    {
        "1":
            {
                "type":"freeform",
                "question":"Do you like this assignment?"
            },
        "2":{    
                "type":"mcq",
                "question":"What languages do you know",
                "options":["python","c++", "java"]
            },
        "3":{    
                "type":"radio",
                "question":"Do you like working on the weekends",
                "options":["yes","no", "hell no"]
            },
        "4":{
                "type":"available_times",
                "question":"what times are you free?"
            }  
    }
}; 
it('renders correctly', () => {
  const tree = renderer.create(
    <AnswerSurveyComponent {...AnswerSurveyComponentDetails}/>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});