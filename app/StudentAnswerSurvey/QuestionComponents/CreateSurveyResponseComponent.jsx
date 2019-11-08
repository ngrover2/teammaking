// Component that returns the survey to be displayed by AnswerSurveyComponent
import React from 'react';
import {
  Container,
  Menu,
} from 'semantic-ui-react';
import { default as FreeformComponent } from "./CreateFreeformComponent.jsx";


function createRequiredComponents(questions)
/* function to go through the json questions and convert them into components*/
{
    var generatedForm = "";
    for (var question in questions)
        switch (question.type) {
            case "freeform":
                generatedForm = generatedForm.concat("<FreeformComponent {...question}/>")
                break;
        
            default:
                break;
        }
}


export default function CreateSurveyResponseComponent(props){
    const deadline = new Date(props.survey_details.deadline*1000);// deadline is in UNIX timestamp. We convert it to JS date object
    const surveyComponents = createRequiredComponents(props.questions);
    return (
        <div>
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item as='a' header>
                    {props.survey_details.course_name}
                </Menu.Item>
                <Menu.Item as='a'>
                    {props.survey_details.course_instructor}
                </Menu.Item>
                <Menu.Item as='a'>
                    Deadline : {deadline.toString()}
                </Menu.Item>
            </Container>
        </Menu>
        </div>
  );
}