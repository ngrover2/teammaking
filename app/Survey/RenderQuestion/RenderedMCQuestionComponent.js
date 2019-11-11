import React from 'react';
import { useState, useEffect } from 'react'
import { Form, Label, Grid, Message, Segment, TextArea, Button, Checkbox, Icon, Header, Input } from 'semantic-ui-react';
import { GridRowMessageComponent, QuestionWeightFormFieldComponent, questionWeights } from "../../Utils/UtilComponents";

const CheckboxComponent = (props) => <Checkbox checked={props.checked} onChange={(e, { checked } ) => props.onChange(checked)}/>
const LabelComponent = (props) => <Label>{props.value}</Label>

const ChoiceComponent = (props) => {
	if (props.checked){
		// controlled component
		return (
			<div>
				<CheckboxComponent checked={props.checked} onChange={(checked) => {(props.onChange) ? props.onChange(checked) : 0}}/>
				<LabelComponent value={props.value}/>
			</div>
		);
	}else{
		// Uncontrolled component
		return (
			<div>
				<CheckboxComponent onChange={(checked) => {(props.onChange) ? props.onChange(checked) : 0}}/>
				<LabelComponent value={props.value}/>
				<Icon name="address book" onClick={props.onRemove ? props.onRemove : false}/>
			</div>
		);
	}
}


const RenderedMCQuestionComponentInGrid = (props) => {


	const createValues = () => {
		let values = []
		if (props.choices && props.choices.length > 0){
			props.choices.forEach((v,i)=>{
				values.push(<Grid.Column width={16}><ChoiceComponent key={i} checked={v.checked} value={v.value} onRemove={() => props.onRemove(props.qid,i)}/></Grid.Column>)
			});
		}else{
			values.push(<Grid.Column width={16}><Message size="tiny"><Header>No Choices</Header></Message></Grid.Column>)
		}
		return values;
	}
	

	return [
		<Grid.Row columns={12} key={`rendered-mc-${props.qid}`}>
			<Grid.Column width={16}>
				<Segment className="fullwidth">
					<Grid>
						<Grid.Row columns={16}>
							<Grid.Column width={16}>
								<GridRowMessageComponent size="large" message={props.qtext}/>
							</Grid.Column>
						</Grid.Row>
						{
							props.choices && props.choices.length > 0 &&
								<Grid.Row columns={16}>
										{createValues()}
								</Grid.Row>
						}
						<Grid.Row columns={12}>
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


const RenderedMCQuestionComponent = (props) => {
	
	const [ questionWeight, setQuestionWeight ] = useState(props.qweight);
	const [ questionText, setQuestionText ] = useState(props.qtext);
	const [ questionChoices, setQuestionChoices ] = useState(props.choices);
	const [ newQuestionChoice, setNewQuestionChoice ] = useState("");
	const [ questionEditable, setQuestionEditable ]  = useState(false);
	const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0);

	useEffect(() => {
		if (questionUpdatedId == 0) return
		
		let updatedQObj = Object.assign({},{
			qid: props.qid,
			qtype: "multiplechoice",
			qtext: questionText,
			qweight: questionWeight,
			choices: questionChoices,
		})
		props.onQuestionUpdated(updatedQObj);
	},[questionUpdatedId])

	useEffect(() => {
		setQuestionText(props.qtext);
		mergeChoices();
		setQuestionWeight(props.qweight);
	},[props.qid])

	const mergeChoices = () => {
		console.log("mergeChoices called with choices: ", questionChoices);
		let localChoices = [...questionChoices]
		let localChoiceValues = localChoices.map((v)=> v.value);
		let newChoices = props.choices.filter((v) => !localChoiceValues.includes(v.value));
		let mergedChoices = [...localChoices, ...newChoices];
		setQuestionChoices(mergedChoices);
	}

	function removeChoice(choiceId){
		// console.log(`${choiceId} to be deleted`) // DEBUG
		setQuestionChoices([
			...questionChoices.slice(0, choiceId),
			...questionChoices.slice(choiceId+1, questionChoices.length),
		]);
	}

	function addChoice(choiceText){
		let choiceObj = {
			value:choiceText,
			checked:false
		};

		let isDuplicate = questionChoices.filter((v) => {
			if (v.value == choiceText){
				return v
			}
		}).length > 0;
		isDuplicate ? undefined : setQuestionChoices([
										...questionChoices.slice(0),
										choiceObj
									]);
		setNewQuestionChoice("");
	}

	const createValues = () => {
		let values = []
		if (questionChoices && questionChoices.length > 0){
			questionChoices.forEach((v,i)=>{
				values.push(
					<Form.Group key={`mc-Q-${props.qid || -1}-choice-${i}`} style={{ alignItems:"center"}}>
						<Form.Checkbox
							label={v.value}
							key={i}	
						>
						</Form.Checkbox>
						{questionEditable && <Form.Button icon="remove" size="mini"
							onClick={() => {/*props.onRemove(props.qid, i);*/removeChoice(i)}}
						>
						</Form.Button>}
					</Form.Group>
				)
			});
		}else{
			return <Message key={`mc-Q-${props.qid || -1}-no-choices`} size="tiny">No Choices Added Yet</Message>
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

export default RenderedMCQuestionComponent;



