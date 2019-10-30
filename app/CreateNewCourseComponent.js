import React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { Divider, Modal, Form, FormField, Dropdown, Radio, FormButton, TextArea, FormCheckbox, Checkbox, Button, Grid, FormGroup, FormTextArea, Segment, Message} from 'semantic-ui-react';
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

export default function CreateNewCourseComponent(props){

    const [ open, setOpen ] = useState(false);
    const [ formRef ] = useState(React.createRef());
    const [ formSubmittedId, setFormSubmittedId ] = useState(0);
    const pid = props.pid;
    
    const [ courseName, setCourseName ] = useState("");
    const [ courseCode, setCourseCode ] = useState("");
    const [ courseDesc, setCourseDesc ] = useState("");
    const [ tAEmail, setTaEmail ] = useState("");
    const [ tAName, setTaName ] = useState("");
    const [ startDate, setStartDate ] = useState()
    const [ endDate, setEndDate ] = useState()
    const [ classStartTime, setClassStartTime ] = useState(moment().format("hh:mm"))
    const [ classEndTime, setClassEndTime ] = useState(moment().format("hh:mm"))
    
    const [ courseCreated, setCourseCreated ] = useState(false);
    const [ okayHandled, setOkHandled ] = useState(false);
    const [ okayType, setOkType ] = useState("action");
    const [ feedbackModalOpen, setFeedbackModalOpen ] = useState(false);
    const [ feedbackModalMessage, setFeedbackModalMessage ] = useState(false);

    const [ ignoreWarnings, setIgnoreWarnings ] = useState(false);

    // console.log("startDate", startDate)
    // console.log("endDate", endDate)
    // console.log("classStartTime", classStartTime)
    // console.log("classEndTime", classEndTime) // DEBUG

    useEffect(() => {
        if (formSubmittedId == 0) return;
        console.log("Handle Submit called"); 
        // console.log(startDate);
        // console.log(endDate);
        // console.log(classStartTime);
        // console.log(classEndTime);
        // console.log(courseName);
        // console.log(courseCode);
        // console.log(courseDesc);
        // console.log(tAEmail);
        // console.log(tAName); // DEBUG
        let warningMessages = ""
        if (!courseCode){
            setFeedbackModalMessage("Course Code cannot be empty.")
            setOkType("invalid")
            setFeedbackModalOpen(true);
        }else if (!courseName){
            setFeedbackModalMessage("Course Name cannot be empty.")
            setOkType("invalid")
            setFeedbackModalOpen(true);
        }
        else{
            if (!courseDesc){
                if (!ignoreWarnings){
                    warningMessages += "Note: You have not set any description for the course\n"
                }
            }
            if (!tAEmail){
                if (!ignoreWarnings){
                    warningMessages += "You have not set any email address for the course's Teaching Assistant\n"
                }
            }
            if (!tAName){
                if (!ignoreWarnings){
                    warningMessages += "You have not set a name for the course's Teaching Assistant"
                }
            }
            if (!ignoreWarnings && (warningMessages != "")){
                setOkType("warn")
                setFeedbackModalMessage(warningMessages);
                setFeedbackModalOpen(true);
            }else{
                // Try to create the course using the server API
                sendCreateRequest();
            }
        }
    },[formSubmittedId])

    const sendCreateRequest = async function(){
        console.log("Trying to CREATE COURSE")
        let postBody = {
            "course_code": courseCode,
            "course_name": courseName,
            "course_description": courseDesc,
            "ta_name": tAName,
            "ta_email": tAEmail,
            "professor_id": pid,
            "start_date": startDate,
            "end_date": endDate,
            "class_start_time": classStartTime + ":00",
            "class_end_time": classEndTime + ":00",
        }
        try{
            let response = await fetch(`http://localhost:3000/professor/${pid}/course/save`, {
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
                    setFeedbackModalMessage("Course created successfully");
                    setFeedbackModalOpen(true);
                }else{
                    setFeedbackModalMessage((responseJson.reason && `${responseJson.reason}`) || (responseJson.errorFull && `${responseJson.errorFull}`) || "Problem creating the new course");
                    setFeedbackModalOpen(true);
                }
            }else{
                setFeedbackModalMessage("Problem creating the new course");
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
    },[courseCreated])

    useEffect(() => {
        setFeedbackModalOpen(false);
    },[okayHandled])

    return (
        <div>
        {courseCreated && (<Redirect to={`professor/${pid}/course`}/>)}
        {
            (<Modal 
                trigger={<Button onClick={() => setOpen(true)} fluid style={{ background:"none", fontSize:"1.5rem", color:"white", border:"2px solid white", borderRadius:"7px" }}>Create New Course</Button>}
                open={open}
            >
                <Modal.Header>
                    {props.header || "Create New Course"}
                </Modal.Header>
                <Modal.Content scrolling>
                    <Form ref={formRef} onSubmit={() => setFormSubmittedId(formSubmittedId+1)}>
                            <FormField
                                label={"Course Name"}
                                placeholder={"Enter Course Name"}
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                control="input"
                            />
                            <Divider />
                            <FormField
                                label={"Course Code"}
                                placeholder={"Enter Course Code e.g. ITCS XXXX"}
                                value={courseCode}
                                control="input"
                                onChange={(e) => setCourseCode(e.target.value)}
                            />
                            <FormField
                                label={"Course Description"}
                                placeholder={"Enter Teaching Assistant's Email ID"}
                                control="textarea"
                                style={{height:"100px"}}
                                value={courseDesc}
                                onChange={(e) => setCourseDesc(e.target.value)}
                            />
                            <FormField
                                label={"Teaching Assistant"}
                                placeholder={"Enter Teaching Assistant's name"}
                                control="input"
                                value={tAName}
                                onChange={(e) => setTaName(e.target.value)}
                            />
                            <FormField
                                label={"Teaching Assistant Email ID"}
                                placeholder={"Enter Teaching Assistant's Email ID"}
                                control="input"
                                value={tAEmail}
                                onChange={(e) => setTaEmail(e.target.value)}
                            />
                            <FormGroup
                                style={{ alignItems:"center" }}
                            >
                                <FormField
                                    label={"Class Start Time"}
                                    placeholder={"Enter Teaching Assistant's Email ID"}
                                />
                                <TimePicker
                                    showSecond={false}
                                    defaultValue={moment()}
                                    onChange={(value) => setClassStartTime(value.format('HH:mm'))}
                                />
                                <FormField
                                    label={"Class End Time"}
                                    placeholder={"Enter Teaching Assistant's Email ID"}
                                />
                                <TimePicker
                                    showSecond={false}
                                    defaultValue={moment()}
                                    onChange={(value) => setClassEndTime(value.format('HH:mm'))}
                                />  
                            </FormGroup>
                            <FormGroup
                                style={{ alignItems:"center" }}
                            >
                                <DatePickerComponent onChange={setStartDate}/>
                                <DatePickerComponent onChange={setEndDate}/>
                            </FormGroup>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={() => console.log(formRef.current.handleSubmit())}>Create Course</Button>
                    <Button negative onClick={ () => {
                                                setOpen(false);
                                                setCourseName("");
                                                setCourseCode("");
                                                setTaEmail("");
                                                setTaName("");
                                                setCourseDesc("");
                                            }
                                        }>Cancel</Button>
                </Modal.Actions>
            </Modal>)}
        {<Modal open={feedbackModalOpen}>
                <Modal.Content>{feedbackModalMessage}</Modal.Content>
                <Modal.Actions>
                        <Button onClick={() => {
                                if (okayType == "success"){
                                    setCourseCreated(true)
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