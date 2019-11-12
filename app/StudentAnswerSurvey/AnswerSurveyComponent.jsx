// Component for Student to answer the survey. Responsible for making network calls and calling the main component that renders the survey
import React from 'react';
import { useParams } from 'react-router-dom';
import { default as CreateSurveyResponse } from './QuestionComponents/CreateSurveyResponseComponent.jsx';

export default function AnswerSurveyComponent(props){
  /* mock of object that the component should receive from the server*/
  const response = {
      "survey_details":{
        "course_name":"SSDI",
        "course_instructor":"Harini",
        "deadline":1993139865
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
  const  { surveyId } = useParams();
  return (
    <div>
      <CreateSurveyResponse  {...response} />
    </div>
  )
  ;
}