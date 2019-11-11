import React from 'react';
import { useState, useEffect } from 'react';
import { Input, Form, Grid, Message, Segment, TextArea, Button, FormTextArea, Header } from 'semantic-ui-react';
import { GridRowMessageComponent, QuestionWeightFormFieldComponent, questionWeights } from "../../Utils/UtilComponents";


const TextQuestion = (props) => {
	const [ questionText, setQuestionText ] = useState(props.qtext);
	const [ questionWeight, setQuestionWeight ] = useState(props.qweight);
	const [ questionEditable, setQuestionEditable ] = useState(false);
	const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0);

	const [ questionObj ] = useState({qtype:"text", qtext:props.qtext, qid:props.qid, qweight:props.qweight})

	useEffect(() => {
		if (questionUpdatedId == 0) return
		console.log("received props in createtextcomponent",props)
		console.log("cchange through edit in createtextcomponent",Object.assign({},questionObj,{qtext:questionText, qweight:questionWeight}))
		props.onQuestionUpdated(Object.assign({},questionObj,{qtye:"text", qtext:questionText, qweight:questionWeight}));
	},[questionUpdatedId])

	useEffect(() => {
		setQuestionText(props.qtext);
		setQuestionWeight(props.qweight)
	},[props])

        
	function renderedQuestionText(){
        if (questionEditable == false){
            return [
                <Form.Field key={`rendered-txt-qtext-${props.qid}-field-noedit`}>
                    <Header>{`Question #${props.qseqno+1}: ${questionText}`}</Header>
                </Form.Field>
            ]
        }else{
            return [
                <Form.Field key={`rendered-txt-qtext-${props.qid}-field-edit`}>
                    <Input value={questionText} onChange={(e) => setQuestionText(e.target.value)} label="Enter question text"></Input>
                </Form.Field>
            ]
        }
	}
	

	return [
		<Grid.Row key={`rendered-txt-${props.qid}`}>
			<Grid.Column width={16}>
				<Segment className="fullwidth">
					<Form>
						{renderedQuestionText()}
						{questionEditable &&
							<QuestionWeightFormFieldComponent options={questionWeights} onWeightUpdated={(weight) => setQuestionWeight(weight)} selectedWeight={questionWeight}/>
						}
						<Form.Field>
							<Form.TextArea label="Type your answer below"/>	
						</Form.Field>
						<Form.Group>
							<Form.Button onClick={() => {
								if (questionEditable){
									setQuestionUpdatedId(questionUpdatedId+1);
									setQuestionEditable(!questionEditable);
								}else{
									setQuestionEditable(!questionEditable);
								}
							}}>
								{questionEditable == true ? "Save Question" : "Edit Question"}
							</Form.Button>
							<Form.Button onClick={() => props.onDeleteClick(props.qid)}>Delete Question</Form.Button>
						</Form.Group>
					</Form>
				</Segment>
			</Grid.Column>
		</Grid.Row>
	];
}

const TextQuestionInGrid = (props) => {
	return [
		<Grid.Row columns={12} key={`rendered-txt-${props.qid}`}>
			<Grid.Column width={16}>
				<Segment className="fullwidth">
					<Grid>
						<Grid.Row columns={16}>
							<Grid.Column width={16}>
								<GridRowMessageComponent size="large" message={props.qtext}/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={16}>
							<Grid.Column width={16}>
								<Form>
									<Form.TextArea label="Type your answer below"/>
								</Form>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={16}>
							<Grid.Column width={16}>
								<Button onClick={() => props.onDeleteClick(props.qid)}>DELETE</Button>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>
			</Grid.Column>
		</Grid.Row>
	];
}

export default TextQuestion;