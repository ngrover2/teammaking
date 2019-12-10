// Component to create new Survey.
import React from 'react';
import { Redirect, useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Grid, Segment, Button } from 'semantic-ui-react';
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
import { default as LoaderSegmentComponent } from "../Utils/LoaderSegmentComponent";
import { default as MessageComponent } from "../Utils/ErrorMessageComponent";
import moment from 'moment';


export default function RenderSavedSurveyComponent(props) {

    const [ displayedQuestionComponents, setDisplayedQuestionComponents ] = useState(<Grid.Row columns={16}><Grid.Column width={16}><Segment key={"mock-message"}>No Questons Added Yet</Segment></Grid.Column></Grid.Row>); // Placeholder content when there have been no questions added yet.
    const [ displayedQuestionObjects, setDisplayedQuestionObjects ] = useState(props.displayedQuestionObjects || []); // For holding rendered questions (i.e. question components created from questions data we have so far)

    const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0); // For side effects on new Question creation  OR existing question modification

    const [ newQuestionType, setNewQuestionType ] = useState("text"); // Track new question's answer type

    const[ currentQuestionId, setCurrentQuestionId ] = useState(props.displayedQuestionObjects ? props.displayedQuestionObjects.length : 0); // Track if a new question is being created

    const[ clearInputsId, setClearInputsId ] = useState(0); // Track if a new question is being created
    
    const[ surveyDeadline, setSurveyDeadline ] = useState(); // Track survey deadline date

    const  history = useHistory();

    const [ initialFetchId ] = useState(0);
    const [ uploadAttemptId, setUploadAttemptId ] = useState(0);
    const [ uploadSucceeded, setUploadSucceeded ] = useState(false);
    const [ okHandled, setOkHandled ] = useState(true);
    const [ showLoader, setShowLoader ] = useState(true);
    const [ redirectToCreateSurvey, setRedirectToCreateSurvey ] = useState(false);

    const { sid, cid, pid} = useParams();

    const [ surveyEditable, setSurveyEditable ] = useState(false);
    const [ messageModalOpen, setMessageModalOpen ] = useState(false);
    const [ message, setMessage ] = useState("");   

    useEffect(() => {
        console.log("useEffect called for fetchSurvey");
        var fetchedSurvey = null;
        async function fetchSurvey(){
            // let postBody = {
            //     survey_id: sid,
            // }
            fetchedSurvey = await fetch(`http://localhost:3000/professor/${pid}/course/${cid}/survey/${sid}`,{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache'
            })
            .then(
                (successRes) => successRes,
                (failureRes) => []
            )
            .then(
                (resolvedRes) => {console.log("resolvedRes",resolvedRes);return resolvedRes.json()},
            ).catch((error) => {
                throw Error("Response is not Json. The url is not valid")
            })
            .then(
                (json) => {console.log("json",json);return json.result},
            )
            .catch((error) => {
                console.log(error);
                setShowLoader(false);
            });
            // console.log(`fetchedSurvey.question_object,`, fetchedSurvey[0])
            if (fetchedSurvey && fetchedSurvey[0] && fetchedSurvey[0].question_object){
                // console.log(`Data Fetched, fetchedSurvey`)
                let surveyObject = fetchedSurvey[0].question_object;
                let questionsObject = JSON.parse(surveyObject);
                let questions = [];
                console.log(`questions,`, questionsObject);
                for (var property in questionsObject){
                    questions.push(questionsObject[property]);
                }
                if (Array.isArray(questions) && questions.length > 0){
                    let dateFitForDatePicker = moment(fetchedSurvey[0].deadline).toDate();
                    console.log("Will set deadline from" ,surveyDeadline ,"to saved deadline", dateFitForDatePicker);
                    setSurveyDeadline(dateFitForDatePicker);
                    setDisplayedQuestionObjects(questions);
                    setCurrentQuestionId(questions.length+1);
                    setQuestionUpdatedId(questionUpdatedId+1);
                    setShowLoader(false);
                }
            }else{
                setShowLoader(false);
            }
        }
        fetchSurvey();
    }, [initialFetchId])

    useEffect(()=> {
        if (uploadAttemptId !== 0) uploadSurvey();
    },[uploadAttemptId])

    useEffect(() => {
        setOkHandled(!messageModalOpen);
    },[messageModalOpen])

    async function uploadSurvey(){
        // console.log("update survey called")
        if (displayedQuestionObjects.length <= 0){
            setMessage("A survey needs to have at least one question");
            setMessageModalOpen(true);
            return;
        }

        if (surveyDeadline == undefined || surveyDeadline == null){
            setMessage("You have not selected a deadline. it is a required argument");
            setMessageModalOpen(true);
            return;
        }else{
            console.log("Saving date:", surveyDeadline);
        }

        let postBody = {
            surveyObject: {
                questions: displayedQuestionObjects,
                deadline: surveyDeadline ? moment(surveyDeadline).format("YYYY-MM-DD HH:mm:ss") : null,
                title: "Help me help you"
            },
        }
        // console.log("Will upload", postBody); // DEBUG
        try{
            let response = null;
            let responseJson = null;
            try{
                response = await fetch(`http://localhost:3000/professor/${pid}/course/${cid}/survey/${sid}/update`, {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    cache: 'no-cache',
                    body: JSON.stringify(postBody)
                });
            }catch(e){
                throw Error(`Network request did not succeed. Error: ${e.message || JSON.stringify(e)}`)
            }
            
            if (!response){
                throw new Error("Network error prevented the request from succeeding.")
            }
            try{
                responseJson = await response.json()
            }catch{
                throw new Error("Invalid server response")
            }
            if (responseJson){
                if (responseJson.status == "ok"){
                    // console.log("responseJson", responseJson);
                    setMessage("Survey updated successfully");
                    setMessageModalOpen(true);
                    setUploadSucceeded(true);
                }else{
                    setMessage(`${responseJson.error || responseJson.errorFull || "An error occurred trying to upload the survey"}`);
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

    useEffect(() => {
        if (questionUpdatedId == 0 && currentQuestionId == 0) return
        // console.log("displayedQuestionObjects",displayedQuestionObjects);
        if (displayedQuestionObjects.length == 0){
            setDisplayedQuestionComponents(<Segment key={"mock-message"}>No Questons Added Yet</Segment>);
        }else{

        }
        // console.log("questionUpdatedId changed, new question must have been added") // DEBUG
        let newDisplayedQuestionComponents = [];
        [...displayedQuestionObjects].reverse().forEach((v,i) => {
            if (v.qtype == "text"){
                newDisplayedQuestionComponents.push(
                    <RenderedTextQuestionComponent 
                        key={v.qid != undefined ? `q-${v.qid}` : `q-${i}`}
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
                        key={v.qid != undefined ? `q-${v.qid}` : `q-${i}`}
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
                        key={v.qid != undefined ? `q-${v.qid}` : `q-${i}`}
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
                        key={v.qid != undefined ? `q-${v.qid}` : `q-${i}`}
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

    const renderMessageComponent = () => {
        return <MessageComponent key={`course-${cid}-survey-${sid}-update-survey-feedback`} errorMessage={message} open={messageModalOpen} closeModal={() => setMessageModalOpen(false)}/>
    }


    if (redirectToCreateSurvey){
        return <Redirect to={`/professor/${pid}/course/${cid}/survey/create`}></Redirect>
    }else if (showLoader){
        return <LoaderSegmentComponent />
    }else if (uploadSucceeded && okHandled){
        return <Redirect to={`/professor/${pid}/course`} />
    }
    else if(displayedQuestionObjects.length == 0){
        return (
            <Grid columns={16}>
                <GridRowMessageComponent message={"You have not added a survey yet"}/>
                <Grid.Row centered>
                    <Grid.Column width={6}>
                        <Button fluid positive onClick={() => setRedirectToCreateSurvey(true)}>Create Survey</Button>
                    </Grid.Column>
                </Grid.Row>
                {renderMessageComponent()}
            </Grid>
        );
    }else{
        if(surveyEditable){
            console.log("will pass defaultdate to picker", surveyDeadline);
            return (
                <Grid columns={12}>
                    <SelectQuestionType readyAddNewQuestion={(type) => readyAddNewQuestion(type)} clearInputs={clearInputs}/>
                    <GridRowMessageComponent message={"Construct your question below"}/>
                    {getQuestionCreatorComponent()}
                    <FullWidthDivider/>
                    <GridRowMessageComponent size="small" message={"All questions created by you will appear below"}/>
                    <DatePickerGridRowComponent defaultDate={moment(surveyDeadline)} key={`survey-pick-deadline`} onChange={setSurveyDeadline}/>
                    {displayedQuestionComponents.length > 0 && displayedQuestionComponents || (<Grid.Row columns={16}><Grid.Column width={16}><Segment key={"mock-message"}>No Questons Added Yet</Segment></Grid.Column></Grid.Row>)}
                    <Grid.Row columns={16} centered>
                        <Grid.Column width={8} >
                            <Button positive fluid onClick={() => {
                                    setUploadAttemptId(uploadAttemptId+1);
                                }
                            }>
                                Update Survey
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Button basic inverted fluid onClick={() => setSurveyEditable(false)}>
                                Cancel
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={16} style={{minHeight:"100px"}}>
                        <Grid.Column width={16} />
                    </Grid.Row>
                    {renderMessageComponent()}
                </Grid>
            );
        }else{
            return (
                <Grid columns={12}>
                    {displayedQuestionComponents.length > 0 && displayedQuestionComponents || (<Grid.Row columns={16}><Grid.Column width={16}><Segment key={"mock-message"}>No Questons Added Yet</Segment></Grid.Column></Grid.Row>)}
                    <Grid.Row columns={16} centered>
                        <Grid.Column width={8} >
                            <Button positive fluid onClick={() => {
                                    setSurveyEditable(true);
                                }
                            }>
                                Edit Survey
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Button basic inverted fluid onClick={() => history.goBack()}>
                                Go Back
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={16} style={{minHeight:"100px"}}>
                        <Grid.Column width={16} />
                    </Grid.Row>
                    {renderMessageComponent()}
                </Grid>
            );
        }
    }
}