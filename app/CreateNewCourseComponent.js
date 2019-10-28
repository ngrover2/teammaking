import React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { Divider, Modal, Form, FormField, Dropdown, Radio, FormButton, TextArea, FormCheckbox, Checkbox, Button, Grid, FormGroup, FormTextArea, Segment, Message} from 'semantic-ui-react';


export default function CreateNewCourseComponent(props){

    const [ open, setOpen ] = useState(false);
    const [ formRef ] = useState(React.createRef());
    
    const [ courseName, setCourseName ] = useState("");
    const [ courseCode, setCourseCode ] = useState("");
    const [ courseDesc, setCourseDesc ] = useState("");
    const [ tAEmail, setTaEmail ] = useState("");
    const [ tAName, setTaName ] = useState("");
    
    const [ courseCreated, setCourseCreated ] = useState(false);
    const [ okayHandled, setOkHandled ] = useState(false);
    const [ feedbackModalOpen, setFeedbackModalOpen ] = useState(false);

    useEffect(() => {
        setFeedbackModalOpen(true);
    },[courseCreated])

    useEffect(() => {
        setFeedbackModalOpen(false);
    },[okayHandled])

    return (
        <div>
        {okayHandled && (<Redirect to={"/course"}/>)}
        {(!courseCreated) &&
            (<Modal 
                trigger={<Button onClick={() => setOpen(true)} fluid>Create New Course</Button>}
                open={open}
            >

                <Modal.Header>
                    {props.header || "Create New Course"}
                </Modal.Header>
                <Modal.Content scrolling>
                    <Form ref={formRef} onSubmit={() => {console.log("Handle Submit called"); console.log(`courseName:${courseName}, courseCode:${courseCode}, TA Name:${tAName}, TA Email:${tAEmail} `); setCourseCreated(true)}}>
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
        {courseCreated && <Modal open={feedbackModalOpen}>
                <Modal.Content>{"Couse Created Successfully"}</Modal.Content>
                <Modal.Actions>
                        <Button onClick={() => setOkHandled(true)}>
                            Ok
                        </Button>
                </Modal.Actions>
            </Modal>}
        </div>
    )
}