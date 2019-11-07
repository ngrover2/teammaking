// Component to create new Survey.
import React from 'react';
import {
  Container,
  Menu,
} from 'semantic-ui-react';
import { useParams } from 'react-router-dom';

export default function AnswerSurveyComponent(props){
  const response = {
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
  const deadline = new Date(response.survey_details.deadline*1000);// deadline is in UNIX timestamp. We convert it to JS date object
  const  { surveyId } = useParams();
    return (
      <div>
        <Menu fixed='top' inverted>
          <Container>
            <Menu.Item as='a' header>
              {response.survey_details.course_name}
            </Menu.Item>
            <Menu.Item as='a'>
              {response.survey_details.course_instructor}
            </Menu.Item>
            <Menu.Item as='a'>
              Deadline : {deadline.toString()}
            </Menu.Item>
          </Container>
        </Menu>
      </div>
  );
}