// Component to create new Survey.
import React from 'react';
import { useState, useEffect } from 'react';
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
} from 'semantic-ui-react';

import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams
  } from 'react-router-dom';
  
  
  

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
}


const date = new Date(response.deadline*1000);
const hours = date.getHours();
const minutes = "0" + date.getMinutes();
const seconds = "0" + date.getSeconds();
var humanReadableDeadline = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


  const  { survey_id } = useParams();
  console.log(survey_id);
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
            {humanReadableDeadline}
          </Menu.Item>
        </Container>
      </Menu>
    </div>
  );
}