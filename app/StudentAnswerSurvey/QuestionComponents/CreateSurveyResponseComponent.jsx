// Component that returns the survey to be displayed by AnswerSurveyComponent
import React from 'react';
import {
  Container,
  Menu,
  Form,
  Grid,
  Button
} from 'semantic-ui-react';
import { default as FreeformComponent } from "./CreateFreeformComponent.jsx";
import { default as CheckboxComponent } from "./CreateCheckboxComponent.jsx";
import { default as RadioComponent } from "./CreateRadioComponent";
import { element } from 'prop-types';

function deadlinePassedComponent() {
    return(
        <div>
            <h3>Sorry the deadline to fill this survey has passed. Look at images of these fine cats while you re-evaluate your life choices</h3>
            <img src="https://placekitten.com/200/300" alt="kitty"/>
        </div>
    );
}


function createRequiredComponents(questions){
/* function to go through the json questions and convert them into components*/
    var generatedForm = [];
    for (const question_number in questions) {
        if (questions.hasOwnProperty(question_number)) {
            const element = questions[question_number];
            switch (element.type) {
                case "freeform":
                    generatedForm.push(<FreeformComponent key={question_number} {...element} />);
                    break;
                case "mcq":
                        generatedForm.push(<CheckboxComponent questionType = {element.type} key = {question_number} {...element} />);
                        break;
                case "radio":
                        generatedForm.push(<RadioComponent questionType = {element.type} key = {question_number} {...element} />);
                        break;
                        
    
                default:
                    break;
            }  
        }

        
    }
       
    return generatedForm;
}


export default function CreateSurveyResponseComponent(props){
    const deadline = new Date(props.survey_details.deadline*1000);// deadline is in UNIX timestamp. We convert it to JS date object
    const  currentTime = new Date();
    if (+currentTime <= +deadline) 
        var bodyComponents = createRequiredComponents(props.questions);
    else
        var bodyComponents = deadlinePassedComponent();

    

    return [
        <Container>
        <Grid>
            <Grid.Row>
                <Menu key="header" inverted>
                    
                        <Menu.Item as='a' header>
                            {props.survey_details.course_name}
                        </Menu.Item>
                        <Menu.Item as='a'>
                            {props.survey_details.course_instructor}
                        </Menu.Item>
                        <Menu.Item as='a'>
                            Deadline : {deadline.toString()}
                        </Menu.Item>
                </Menu>
            </Grid.Row>
            <Grid.Row>
                <Form>
                    { bodyComponents }
                </Form>
            </Grid.Row>
            <Grid.Row>
                <Button>Submit Survey Response</Button>
            </Grid.Row>
        </Grid>
        </Container>
    ];
}