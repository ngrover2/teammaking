// Component to create new Survey.
import React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Segment, Button } from 'semantic-ui-react';
import { Redirect, useParams, useHistory } from 'react-router-dom';
import { default as SelectQuestionType} from "./SelectQuestionTypeRadioComponent";
import { default as CreateTextQuestion } from "./CreateQuestion/CreateTextTypeQuestionComponent";
import { default as CreateMCQuestionComponent} from "./CreateQuestion/CreateMCTypeQuestionComponent";
import { default as CreateMulValuesQuestionComponent } from "./CreateQuestion/CreateMulValuesQuestionComponent";
import { default as CreateSingleChoiceQuestionComponent } from "./CreateQuestion/CreateSingleChoiceQuestionComponent";

import { default as RenderedTextQuestionComponent} from "./RenderQuestion/RenderedTextQuestionComponent";
import { default as RenderedMCQuestionComponent} from "./RenderQuestion/RenderedMCQuestionComponent";
import { default as RenderedMulValuesQuestionComponent} from "./RenderQuestion/RenderedMulValuesQuestionComponent";
import { default as RenderedSingleChoiceQuestionComponent } from "./RenderQuestion/RenderedSingleChoiceQuestionComponent";

import { FullWidthDivider, GridRowMessageComponent, DatePickerGridRowComponent } from "../Utils/UtilComponents";
import { default as MessageComponent } from "../Utils/ErrorMessageComponent";





export default function SurveyFormQuestionComponent(props) {

    const  history = useHistory();
    const { cid, pid } = useParams();

    const [ displayedQuestionComponents, setDisplayedQuestionComponents ] = useState(<Grid.Row columns={16}><Grid.Column width={16}><Segment key={"mock-message"}>No Questons Added Yet</Segment></Grid.Column></Grid.Row>); // Placeholder content when there have been no questions added yet.
    const [ displayedQuestionObjects, setDisplayedQuestionObjects ] = useState([]); // For holding rendered questions (i.e. question components created from questions data we have so far)

    const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0); // For side effects on new Question creation  OR existing question modification

    const [ newQuestionType, setNewQuestionType ] = useState("text"); // Track new question's answer type

    const[ currentQuestionId, setCurrentQuestionId ] = useState(); // Track if a new question is being created

    const[ clearInputsId, setClearInputsId ] = useState(0); // Track if a new question is being created
    
    const[ surveyDeadline, setSurveyDeadline ] = useState(); // Track survey deadline date

    const [ message, setMessage ] = useState("");
    const [ messageModalOpen, setMessageModalOpen ] = useState(false);

    const [ uploadAttemptId, setUploadAttemptId ] = useState(0);
    const [ uploadSucceeded, setUploadSucceeded ] = useState(false);


    useEffect(() => {
        if (questionUpdatedId == 0 && currentQuestionId == 0) return
        // console.log("displayedQuestionObjects",displayedQuestionObjects);
        if (displayedQuestionObjects.length == 0){
            setDisplayedQuestionComponents(<Segment key={"mock-message"}>No Questons Added Yet</Segment>);
        }
        // console.log("questionUpdatedId changed, new question must have been added") // DEBUG
        let newDisplayedQuestionComponents = [];
        [...displayedQuestionObjects].reverse().forEach((v,i) => {
            if (v.qtype == "text"){
                newDisplayedQuestionComponents.push(
                    <RenderedTextQuestionComponent 
                        key={`q-${v.qid}`}
                        qid={v.qid}
                        qseqno={i}
                        qtext={`${v.qtext}`}
                        qweight={v.qweight}
                        qtype={v.qtype}
                        onDeleteClick={(questionid) => deleteQuestionObject(questionid)}
                        onQuestionUpdated={(qobj) => updateQuestionObject(qobj)}
                    />
                );
            }else if (v.qtype == "multiplechoice"){
                newDisplayedQuestionComponents.push(
                    <RenderedMCQuestionComponent
                        key={`q-${v.qid}`}
                        qid={v.qid}
                        qtext={`${v.qtext}`}
                        qseqno={i}
                        choices={v.choices || []}
                        qweight={v.qweight}
                        qtype={v.qtype}
                        onDeleteClick={(questionid) => deleteQuestionObject(questionid)}
                        onQuestionUpdated={(qobj) => updateQuestionObject(qobj)}
                    />
                );
            }else if (v.qtype == "multiplevalues"){
                newDisplayedQuestionComponents.push(
                    <RenderedMulValuesQuestionComponent
                        key={`q-${v.qid}`}
                        qid={v.qid}
                        qtext={`${v.qtext}`}
                        qseqno={i}
                        qweight={v.qweight}
                        qMaxNumValues={v.qMaxVals}
                        qtype={v.qtype}
                        onDeleteClick={(questionid) => deleteQuestionObject(questionid)}
                        onQuestionUpdated={(qobj) => updateQuestionObject(qobj)}
                    />
                );
            }else if (v.qtype == "singlechoice"){
                newDisplayedQuestionComponents.push(
                    <RenderedSingleChoiceQuestionComponent
                        key={`q-${v.qid}`}
                        qid={v.qid}
                        qtext={`${v.qtext}`}
                        qseqno={i}
                        choices={v.choices || []}
                        defaultChoice={v.defaultChoice}
                        defaultSelected={v.defaultSelected}
                        qweight={v.qweight}
                        qtype={v.qtype}
                        onDeleteClick={(questionid) => deleteQuestionObject(questionid)}
                        onQuestionUpdated={(qobj) => updateQuestionObject(qobj)}
                    />
                );
            }
        });
        setDisplayedQuestionComponents(newDisplayedQuestionComponents);
    },[questionUpdatedId])

    useEffect(()=>{
        if (uploadAttemptId !== 0) uploadSurvey();
    },[uploadAttemptId])

    async function uploadSurvey(){
        let postBody = {
            surveyObject: {
                questions: displayedQuestionObjects,
                deadline: surveyDeadline,
                title: "Help me help you"
            },
        }
        console.log("Will upload", postBody); // DEBUG

        try{
            let response = await fetch(`http://localhost:3000/professor/${pid}/course/${cid}/survey/save`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
                body: JSON.stringify(postBody)
            })
            let responseJson = null;
            if (!response){
                throw new Error("Network error prevented the request from succeeding.")
            }
            try{
                responseJson = await response.json()
            }catch{
                throw new Error("Invalid response received from the server")
            }
            if (responseJson){
                if (responseJson.status == "ok"){
                    console.log(responseJson)
                    setMessage("Survey uploaded successfully");
                    setMessageModalOpen(true);
                    setUploadSucceeded(true);
                }else{
                    setMessage(`${responseJson.error || "An error occurred trying to upload the survey"}`);
                    setMessageModalOpen(true);
                }
            }else{
                throw new Error("Invalid response received from the server")
            }
        }catch(error){
            setMessage(error.message);
            setMessageModalOpen(true);
        }
    }

    const deleteQuestionObject = (questionId) => {
        console.log(`deleteQuestionObject called for ${questionId}`);
        let remaining = [...displayedQuestionObjects].filter((v,i) => v.qid != questionId);
        // let remaining = [...displayedQuestionObjects.slice(0,questionId), ...displayedQuestionObjects.slice(questionId + 1, displayedQuestionObjects.length)]
        setDisplayedQuestionObjects(remaining);
        setQuestionUpdatedId(questionUpdatedId+1);
    }

    const updateQuestionObject = (questionObj) => {
        // console.log("received", questionObj); DEBUG

        let existingQids = [...displayedQuestionObjects].map((v,i) => v.qid );
        if (existingQids.includes(questionObj.qid)){
            // question with the same qid already exists
            let updatedObjects = []
            displayedQuestionObjects.forEach((v,i) => {
                if (v.qid == questionObj.qid){
                    updatedObjects.push(questionObj);
                }else{
                    updatedObjects.push(v);
                }
            });
            setDisplayedQuestionObjects(updatedObjects);
        }else{
            setDisplayedQuestionObjects([...displayedQuestionObjects, questionObj]);
        }
        setQuestionUpdatedId(questionUpdatedId+1);
    }

    const getQuestionCreatorComponent = () => {
        // console.log("newquestion id passed to createquestion is",currentQuestionId);
        switch(newQuestionType){
            case "text": {
                return (
                    <CreateTextQuestion
                        qid={currentQuestionId}
                        qtype="text"
                        onQuestionUpdated={updateQuestionObject}
                        setNewQuestionId={incrementQuestionId}
                        clearInputsId={clearInputsId}
                    />
                );
            }
            case "multiplechoice": {
                return (
                    <CreateMCQuestionComponent
                        qid={currentQuestionId}
                        qtype="multiplechoice"
                        clearInputsId={clearInputsId}
                        onQuestionUpdated={updateQuestionObject}
                        setNewQuestionId={incrementQuestionId}
                    />)
            }
            case "multiplevalues": {
                return (
                    <CreateMulValuesQuestionComponent
                        qid={currentQuestionId}
                        qtype="multiplevalues"
                        onQuestionUpdated={updateQuestionObject}
                        setNewQuestionId={incrementQuestionId}
                    />
                );
            }
            case "singlechoice": {
                return (
                    <CreateSingleChoiceQuestionComponent
                        qid={currentQuestionId}
                        qtype="singlechoice"
                        onQuestionUpdated={updateQuestionObject}
                        setNewQuestionId={incrementQuestionId}
                    />
                );
            }
            default:return
        }
    }

    const clearInputs = () => {
        console.log("clearInputs called to increment clearInputsId:",clearInputsId);
        setClearInputsId(clearInputsId+1);
    }

    const readyAddNewQuestion = (newType) => {
        setCurrentQuestionId(currentQuestionId + 1);
        if (newType && newType != "") setNewQuestionType(newType);
    }

    const incrementQuestionId = () => {
        setCurrentQuestionId(currentQuestionId + 1);
    }

    if (uploadSucceeded && (messageModalOpen == false)){
        return <Redirect to={`/professor/${pid}/course`} />       
    }

    return [
            <Grid columns={12} key={`course-${cid}-create-survey-grid`}>
                <SelectQuestionType readyAddNewQuestion={(type) => readyAddNewQuestion(type)} clearInputs={clearInputs}/>
                <GridRowMessageComponent message={"Construct your question below"}/>
                {getQuestionCreatorComponent()}
                <FullWidthDivider/>
                <GridRowMessageComponent size="small" message={"All questions created by you will appear below"}/>
                <DatePickerGridRowComponent key={`survey-pick-deadline`} onChange={setSurveyDeadline}/>
                {displayedQuestionComponents.length > 0 && displayedQuestionComponents || (<Grid.Row columns={16}><Grid.Column width={16}><Segment key={"mock-message"}>No Questons Added Yet</Segment></Grid.Column></Grid.Row>)}
                <Grid.Row columns={16} centered>
                    <Grid.Column width={8} >
                        <Button positive fluid onClick={() => {
                                setUploadAttemptId(uploadAttemptId+1); 
                            }
                        }>
                            Save Survey
                        </Button>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Button basic inverted fluid onClick={() => history.goBack()}>
                            Cancel
                        </Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={16} style={{minHeight:"100px"}}>
                    <Grid.Column width={16} />
                </Grid.Row>
            </Grid>,
            <MessageComponent key={`course-${cid}-create-survey-feedback`} errorMessage={message} open={messageModalOpen} closeModal={() => setMessageModalOpen(false)}/>
    ];
}

/*<MessageComponent key={`course-${cid}-create-survey-grid`} ref={messageButtonRef} errorMessage={message} open={messageModalOpen} closeModal={() => setMessageModalOpen(false)}/>*/