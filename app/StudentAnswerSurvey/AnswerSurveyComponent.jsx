// Component for Student to answer the survey. Responsible for making network calls and calling the main component that renders the survey
import React from 'react';
import { default as CreateSurveyResponse } from './QuestionComponents/CreateSurveyResponseComponent.jsx';

export default function AnswerSurveyComponent(props){
  /* mock of object that the component should receive from the server*/
  const response = {
      "survey_details":{
        "course_name":"SSDI",
        "course_instructor":"Harini",
        "deadline":1903139865 //deadline is in the future
        // "deadline":1003139865 //deadline has passed

    },
    "questions":
    {
        "1":
            {
                "type":"freeform",
                "question":"How much experience do you have with software creation?"
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

  return (
    <div>
      <CreateSurveyResponse {...response} />
    </div>
  )
  ;
}