// Component to create new Survey.
import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Dropdown, Radio, FormButton, TextArea, FormCheckbox, Checkbox, Button, Grid, FormGroup, FormTextArea, Segment, Message } from 'semantic-ui-react';
import { default as TextQuestion } from "./TextAreaQuestionComponent";


export default function SurveyFormQuestionComponent(props) {

    const [ questionText, setQuestionText ] = useState("");
    const [ numberElementsInForm, setNumberElementsInForm ] = useState(0);
    
    const [ addQuestionComponentReference, setAddQuestionComponentReference ] = useState();
    const [ addQuestionComponentType, setAddQuestionComponentType ] = useState("text"); 

    const [ displayedQuestions, setDisplayedQuestions ] = useState([(<Segment key={numberElementsInForm}>No Questons Added Yet</Segment>)]);
    const [ newQuestionAddedId, setNewQuestionAddedId ] = useState(0);

    const [ displayRendered, setDisplayRendered ] = useState(true);

    const lastRef = React.createRef();

    const TextAreaFormComponent = (props) => {
        return (
            <Grid.Row columns={12}>
                <Grid>
                    <Grid.Row columns={12}>
                        <Message>{props.message}</Message>
                    </Grid.Row>
                    <Grid.Row columns={12}>
                        <Segment>
                            <TextArea />
                        </Segment>
                    </Grid.Row>
                </Grid>
            </Grid.Row>
        );
    }

    useEffect(() => {
        console.log(`Question ID updated to ${newQuestionAddedId}, so use effect called`);
        if (newQuestionAddedId == 0){

        }
        else if (newQuestionAddedId == 1){
            let currentQuestions = [...displayedQuestions].slice(1);
            currentQuestions.push(<TextAreaFormComponent key={numberElementsInForm} message={`Question # ${numberElementsInForm} ${questionText}`} />);
            setDisplayedQuestions(currentQuestions);
            setNumberElementsInForm(numberElementsInForm+1);
        }else{
            let currentQuestions = [...displayedQuestions].slice(0);
            currentQuestions.push(<TextAreaFormComponent key={numberElementsInForm} message={`Question # ${numberElementsInForm} ${questionText}`}></TextAreaFormComponent>);
            setDisplayedQuestions(currentQuestions);
            setNumberElementsInForm(numberElementsInForm+1);
        }
    },[newQuestionAddedId])

    useEffect(() => {
        console.log(`setAddQuestionComponentType updated to ${addQuestionComponentType}, so use effect called`);
        setAddQuestionComponentReference(<TextQuestion setQuestionText={setQuestionText} setDisplayRendered={setDisplayRendered} setNewQuestionAddedId={setNewQuestionAddedId}/>);
    }, [setAddQuestionComponentType])

    return (
            <Grid columns={12}>
                {displayRendered && displayedQuestions}
                <Grid.Row columns={12} key={"addQuestionComponent"}>
                    {addQuestionComponentReference && addQuestionComponentReference}
                </Grid.Row>
            </Grid>
    );
}