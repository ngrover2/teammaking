import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Input, Label, Grid, Segment, Message, Header } from 'semantic-ui-react';
import { FullWidthDivider, GridRowMessageComponent, QuestionWeightGridRowComponent, questionWeights,QuestionWeightFormFieldComponent } from "./UtilComponents";

export default function CreateTextTypeQuestionComponent(props){
    const [ questionText, setQuestionText ] = useState("");
    const [ questionWeight, setQuestionWeight ] = useState("");
    const [ qtexterror ,setQtexterror ] = useState(false);
    const [ questionObject, setQuestionObject ] = useState({
		qtext: "",
		qid: props.qid,
		qtype: "text",
		qweight: ""
	});
    const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0);
    const [ questionObjectUpdatedId, setQuestionObjectUpdatedId ] = useState(0);

    const [ clearInputsId, setClearInputsId ] = useState(0);

    useEffect(() => {
        setQuestionText("");
        setQuestionWeight(null);
    },[clearInputsId])
    
    useEffect(() => {
        setQuestionText("");
    },[props.qid])
    
    useEffect(() => {
        if (questionUpdatedId == 0) return
        let updatedQuestionObj = {
            qid: props.qid,
            qtype: "text",
            qtext: questionText,
            qweight: questionWeight,
        }
        setQuestionObject(updatedQuestionObj);
        setQuestionObjectUpdatedId(questionObjectUpdatedId+1);
    },[questionUpdatedId])

    useEffect(() => {
        if (questionObjectUpdatedId == 0) return
        setQuestionText("");
        setQuestionWeight(null);
        props.setNewQuestionId();
        props.onQuestionUpdated(questionObject);
    },[questionObjectUpdatedId])
    
    

    return  [
        <Grid.Row key={`addTextType-q${props.qid}-grid`} columns={16}>
			<Grid.Column width={16} key={`addMC-q${props.qid}-grid-col-1`}>
                <Segment>
                    <Form>
                        <Form.Field
                            error={qtexterror}
                        >
                            <Label size="large">Enter Question Text : </Label>
                            <input  placeholder="Type Question Text.."  value={questionText} onChange={(e) => {
                                if (qtexterror == true && questionText != "") {
                                    setQtexterror(false);
                                }
                                setQuestionText(e.target.value)
                            }}/>
                        </Form.Field>
                        <QuestionWeightFormFieldComponent options={questionWeights} onWeightUpdated={(weight) => setQuestionWeight(weight)} selectedWeight={questionWeight}/>
                        <Form.Group>
							<Form.Button onClick={() => {
								if (questionText != ""){
									setQuestionUpdatedId(questionUpdatedId+1);
								}else{
									setQtexterror(true);
								}
							}}>
								Save Question
							</Form.Button>
							<Form.Button onClick={() => {
                                setClearInputsId(clearInputsId+1);
							}}>
								Clear
							</Form.Button>
						</Form.Group>
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid.Row>
    ];
}