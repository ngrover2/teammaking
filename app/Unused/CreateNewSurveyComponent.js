// Component to create a new survey for a course and submit to the database.
import React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { Divider, Modal, Form, FormField, Dropdown, Radio, FormButton, TextArea, FormCheckbox, Checkbox, Button, Grid, FormGroup, FormTextArea, Segment, Message, Label} from 'semantic-ui-react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = (props) => {
    const [ date, setDate ] = useState();
    return (
      <DatePicker selected={date} onChange={date => {let d = moment(date).utc().format("YYYY-MM-DD HH:mm:ss");setDate(date); props.onChange(d)}} />
    );
};

export default function CreateNewSurveyComponent(props){

    const [ open, setOpen ] = useState(false);
    const [ formRef ] = useState(React.createRef());
    const [ formSubmittedId, setFormSubmittedId ] = useState(0);
    const pid = props.pid;
    
    const [ surveyName, setSurveyName ] = useState("");
    const [ surveyDesc, setSurveyDesc ] = useState("");
    const [ surveyDeadline, setSurveyDeadline ] = useState()

    const [ surveyCreated, setSurveyCreated ] = useState(false);
    const [ okayHandled, setOkHandled ] = useState(false);
    const [ okayType, setOkType ] = useState("action");
    const [ feedbackModalOpen, setFeedbackModalOpen ] = useState(false);
    const [ feedbackModalMessage, setFeedbackModalMessage ] = useState(false);

    const [ ignoreWarnings, setIgnoreWarnings ] = useState(false);

    // console.log("survey deadline", surveyDeadline) // DEBUG

    useEffect(() => {
        if (formSubmittedId == 0) return;
        console.log("Handle Submit called"); 
        // console.log(surveyDeadline);
        // console.log(surveyName);
        // console.log(surveyDesc);// DEBUG
        let warningMessages = ""
        if (!surveyName){
            setFeedbackModalMessage("Survey Name cannot be empty.")
            setOkType("invalid")
            setFeedbackModalOpen(true);
        }
        else{
            if (!surveyDesc){
                if (!ignoreWarnings){
                    warningMessages += "Note: You have not set any description for the survey\n"
                }
            }
            if (!ignoreWarnings && (warningMessages != "")){
                setOkType("warn")
                setFeedbackModalMessage(warningMessages);
                setFeedbackModalOpen(true);
            }else{
                // Try to create the survey using the server API
                sendCreateRequest();
            }
        }
    },[formSubmittedId])

    const sendCreateRequest = async function(){
        console.log("Trying to CREATE SURVEY")
        let postBody = {
            "survey_name": surveyName,
            "survey_description": surveyDesc,
            "survey_deadline": surveyDeadline,
        }
        try{
            let response = await fetch(`http://localhost:3000/professor/${pid}/course${cid}/survey/save`, { //is this the correct url?
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
                body: JSON.stringify(postBody)
            })
            console.log(JSON.stringify(postBody))
    
            let responseJson = await response.json()
            if (responseJson){
                if (responseJson.status == "ok"){
                    console.log(responseJson)
                    setOkType("success")
                    setFeedbackModalMessage("Survey created successfully");
                    setFeedbackModalOpen(true);
                }else{
                    setFeedbackModalMessage((responseJson.reason && `${responseJson.reason}`) || (responseJson.errorFull && `${responseJson.errorFull}`) || "Problem creating the new survey");
                    setFeedbackModalOpen(true);
                }
            }else{
                setFeedbackModalMessage("Problem creating the new survey");
                setFeedbackModalOpen(true);
            }
        }catch(error){
            console.log(error)
            // setFeedbackModalMessage(error.message);
            setFeedbackModalMessage(error.message + " " + JSON.stringify(error));
            setFeedbackModalOpen(true);
        }
    }

    useEffect(() => {
        setFeedbackModalOpen(false);
        setOpen(false);
        setOpen(false);
        setSurveyName("");
        setSurveyDesc("");
        setSurveyDeadline("");
        if(props.onCreated) props.onCreated();
    },[surveyCreated])

    useEffect(() => {
        setFeedbackModalOpen(false);
    },[okayHandled])

    return (
        <div>
        {/*surveyCreated && (<Redirect to={`professor/${pid}/course/${cid}/survey`}/>)*/}
        {
            (<Modal 
                trigger={<Button onClick={() => setOpen(true)} fluid style={{ background:"none", fontSize:"1.5rem", color:"white", border:"2px solid white", borderRadius:"7px" }}>Create New Survey</Button>}
                open={open}
            >
                <Modal.Header>
                    {props.header || "Create New Survey"}
                </Modal.Header>
                <Modal.Content scrolling>
                    <Form ref={formRef} onSubmit={() => setFormSubmittedId(formSubmittedId+1)}>
                            <FormField
                                label={"Survey Name"}
                                placeholder={"Enter Survey Name"}
                                value={surveyName}
                                onChange={(e) => setSurveyName(e.target.value)}
                                control="input"
                            />
                            <Divider />
                            <FormField
                                label={"Survey Description"}
                                placeholder={"Enter Survey Description"}
                                control="textarea"
                                style={{height:"100px"}}
                                value={surveyDesc}
                                onChange={(e) => setSurveyDesc(e.target.value)}
                            />
                            <FormGroup
                                style={{ alignItems:"center" }}
                            >
                                <FormField
                                    label={"Survey Deadline"}
                                    placeholder={"Select Deadline for survey"}
                                />
                                <TimePicker
                                    showSecond={false}
                                    defaultValue={moment()}
                                    onChange={(value) => setSurveyDeadline(value.format('HH:mm'))}
                                />
                            </FormGroup>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={() => console.log(formRef.current.handleSubmit())}>Create Survey</Button>
                    <Button negative onClick={ () => {
                                                setOpen(false);
                                                setSurveyName("");
                                                setSurveyDeadline("");
                                                setSurveyDesc("");
                                            }
                                        }>Cancel</Button>
                </Modal.Actions>
            </Modal>)}
        {<Modal open={feedbackModalOpen}>
                <Modal.Content>{feedbackModalMessage}</Modal.Content>
                <Modal.Actions>
                        <Button onClick={() => {
                                if (okayType == "success"){
                                    setSurveyCreated(true)
                                }else if (okayType == "inmotion"){
                                    setFeedbackModalMessage("");
                                    setFeedbackModalOpen(false)
                                }else{
                                    setFeedbackModalMessage("");
                                    setFeedbackModalOpen(false)
                                }
                            }
                        }>
                            {okayType == "warn" ? "Cancel" : "Ok"}
                        </Button>
                        {
                            okayType == "warn" && 
                            <Button positive onClick={() => {setIgnoreWarnings(true);formRef.current.handleSubmit()}}>
                                Create
                            </Button>
                        }
                </Modal.Actions>
            </Modal>}
        </div>
    )
}