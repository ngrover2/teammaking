import React from 'react';
import { useState, useEffect } from 'react'
import { Form, Label, Grid, Message, Segment, TextArea, Button, Checkbox, Icon, Header, Input } from 'semantic-ui-react';
import { GridRowMessageComponent, QuestionWeightFormFieldComponent, questionWeights } from "./UtilComponents";


const RenderedSingleChoiceQuestionComponent = (props) => {
	const [ questionWeight, setQuestionWeight ] = useState(props.qweight);
	const [ questionText, setQuestionText ] = useState(props.qtext);
	const [ questionChoices, setQuestionChoices ] = useState(props.choices);
	const [ newQuestionChoice, setNewQuestionChoice ] = useState("");
	const [ selectedChoice, setSelectedChoice ] = useState(props.defaultChoice);
	const [ selectedAsDefaultChoice, setSelectedAsDefaultChoice ] = useState(props.defaultSelected);
	const [ questionEditable, setQuestionEditable ]  = useState(false);
	const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0);

	useEffect(() => {
		if (questionUpdatedId == 0) return
		let updatedQObj = Object.assign({},{
			qid: props.qid,
			qtype: "singlechoice",
			qtext: questionText,
			qweight: questionWeight,
			choices: questionChoices,
			defaultChoice: selectedChoice,
			defaultSelected: selectedAsDefaultChoice
		});
		props.onQuestionUpdated(updatedQObj);
	},[questionUpdatedId])

	useEffect(() => {
		setQuestionText(props.qtext);
		setQuestionWeight(props.qweight);
		setSelectedChoice(props.defaultChoice);
		setSelectedAsDefaultChoice(props.defaultSelected == null ? false : props.defaultSelected);
	},[props.qid])

	useEffect(() => {
		setQuestionText(props.qtext);
		setQuestionWeight(props.qweight);
		setSelectedChoice(props.defaultChoice);
		setSelectedAsDefaultChoice(props.defaultSelected == null ? false : props.defaultSelected);
	},[props]);

	function removeChoice(valueId){
		setQuestionChoices([
			...questionChoices.slice(0, valueId),
			...questionChoices.slice(valueId+1, questionChoices.length),
		]);
	}

	function addChoice(valueText){
		let isDuplicate = questionChoices.filter((v) => v == valueText).length > 0;
		isDuplicate ? undefined : setQuestionChoices([
										...questionChoices.slice(0),
										valueText
									]);
		setNewQuestionChoice("");
	}

	function renderSetAsDefaultCheckbox(){
		return (
			<Form.Checkbox
				key={`rendered-sc-${props.qid}-set-selected-as-default`}
				label="Use selected value as the default choice"
				checked={selectedAsDefaultChoice}
				onChange={(e) => {
					setSelectedAsDefaultChoice(!selectedAsDefaultChoice);
					setQuestionUpdatedId(questionUpdatedId+1);
				}}
			>
			</Form.Checkbox>
		);
	}

	const createValues = () => {
		let values = []
		if (questionChoices && questionChoices.length > 0){
			questionChoices.forEach((v,i)=>{
				values.push(
					<Form.Group key={`mc-Q-${props.qid || -1}-choice-${i}`} style={{ alignItems:"center"}}>
						<Form.Radio
							label={v}
							key={i}
							checked={selectedChoice == v}
							onChange={(e,{label}) => {
								setSelectedChoice(label);
							}}
						>
						</Form.Radio>
						{questionEditable && <Form.Button icon="remove" size="mini"
							onClick={() => {removeChoice(i)}}
						>
						</Form.Button>}
					</Form.Group>
				)
			});
		}else{
			return <Message key={`sc-Q-${props.qid || -1}-no-choices`} size="tiny">No Choices Added Yet</Message>
		}
		return values;
	}

	function renderedQuestionText(){
		if (questionEditable == false){
			return [
				<Form.Field key={`rendered-mc-qtext-${props.qid}-field-noedit`}>
					<Header>{`Question #${props.qseqno+1}: ${questionText}`}</Header>
				</Form.Field>
			]
		}else{
			return [
				<Form.Field key={`rendered-mc-qtext-${props.qid}-field-edit`}>
					<Input value={questionText} onChange={(e) => setQuestionText(e.target.value)} label="Enter question text"></Input>
				</Form.Field>
			]
		}
	}

	return [
		<Grid.Row columns={12} key={`rendered-mc-${props.qid}`}>
			<Grid.Column width={16}>
				<Segment className="fullwidth">
					<Form>
						{
							renderedQuestionText()
						}
						{
							createValues()
						}
						{
							questionEditable &&
							renderSetAsDefaultCheckbox()
						}
						{questionEditable &&
							<Form.Field key={`rendered-mc-qtext-addchoiceInp-${props.qid}`}>
								<Input 
									value={newQuestionChoice} 
									onChange={(e,{value}) => setNewQuestionChoice(value)} 
									labelPosition="right" 
									type="text"
									placeholder="Type Choice.."
								>
									<Label>Enter Question Choice</Label>
									<input/>
									<Label
										onClick = { (e) => {
											if (newQuestionChoice != ""){
												addChoice(newQuestionChoice);
												setNewQuestionChoice("");
											}
										}}
										icon="add"
									>
									</Label>
								</Input>
							</Form.Field>
						}
						{questionEditable &&	
							<QuestionWeightFormFieldComponent options={questionWeights} onWeightUpdated={(weight) => setQuestionWeight(weight)} selectedWeight={questionWeight}/>
						}
						<Form.Group>
							<Form.Button onClick={() => {
								if (questionEditable){
									if (newQuestionChoice!="") addChoice(newQuestionChoice);
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

export default RenderedSingleChoiceQuestionComponent;