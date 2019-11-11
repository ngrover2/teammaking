import React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Input, Label, Segment, Button, Form, Message, Header } from 'semantic-ui-react';
import { QuestionWeightFormFieldComponent, questionWeights, qtypeToReadableMapping } from "./UtilComponents";

export default function CreateMCTypeQuestionComponent(props){
	const [ questionText, setQuestionText ] = useState(""); // Tracks local changes to question Text via the 'Enter Question Text' input box
	const [ questionChoice, setQuestionChoice ] = useState(""); // Tracks local changes to answer choice being added via the 'Enter Question choice' input box
	const [ questionWeight, setQuestionWeight ] = useState(""); // Tracks local changes to question weight selected via the 'Select weight' radio button group
	const [ questionChoices, setQuestionChoices ] = useState([]); // Keeps copy of all answer choices that have been added so far, even from the edit button in RenderedMCQuestionComponent
	const [ qtexterror, setQtexterror ] = useState(false);
	
	const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0);
	const [ questionObject, setQuestionObject ] = useState({
		qtext: "",
		qid: props.qid,
		qtype: "multiplechoice",
		qweight: "",
		choices: "",
	});

	const [ questionObjectUpdatedId, setQuestionObjectUpdatedId ] = useState(0);

	const [ clearInputsId, setClearInputsId ] = useState(0);

    useEffect(() => {
		setQuestionText("");
		setQuestionChoice("");
		setQuestionChoices([]);
		setQuestionWeight("");
	},[clearInputsId]);
	
	useEffect(() => {
		setQuestionText("");
		setQuestionChoice("");
		setQuestionWeight("");
		setQuestionChoices([]);
	},[props.qid])

    useEffect(() => {
		if (questionUpdatedId == 0) return
		let updatedQuestionObj = Object.assign({},questionObject,{
			qid: props.qid,
			qtext:questionText,
			choices: questionChoices,
			qweight: questionWeight
		});
		setQuestionObject(updatedQuestionObj);
		setQuestionObjectUpdatedId(questionObjectUpdatedId+1);
	},[questionUpdatedId])
	

	useEffect(() => {
		if (questionObjectUpdatedId == 0) return
		props.setNewQuestionId();
		props.onQuestionUpdated(questionObject);
	},[questionObjectUpdatedId])

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
		isDuplicate ? 0 : setQuestionChoices([
										...questionChoices.slice(0),
										choiceObj
									]);
		setQuestionChoice("");
	}

	const renderChoices = () => {
		let values = []
		if (questionChoices && questionChoices.length > 0){
			questionChoices.forEach((v,i) => {
				values.push(
					<Form.Group key={`mc-Q-${props.qid || -1}-choice-${i}`} style={{ alignItems:"center"}}>
						<Form.Checkbox
							label={v.value}
							key={i}	
						>
						</Form.Checkbox>
						<Form.Button icon="remove" size="mini"
							onClick={() => {removeChoice(i)}}
						>
						</Form.Button>
					</Form.Group>
				)
			});
		}else{
			return <Message key={`mc-Q-${props.qid || -1}-no-choices`} size="tiny">No Choices Added Yet</Message>
		}
		return values;
	}
	
    return  [
		<Grid.Row key={`addMC-q${props.qid}-grid`} columns={16}>
			<Grid.Column width={16} key={`addMC-q${props.qid}-grid-col-1`}>
				<Segment>
					<Form>
						<Form.Field
							error={qtexterror}
						>
							<Label size="large">Enter Question Text : </Label>
							<input  placeholder="Type Question Text.."  value = {questionText} onChange={(e) => {
								if (qtexterror == true && questionText != "") {
									setQtexterror(false);
								}
								setQuestionText(e.target.value);
							}}/>
						</Form.Field>
						<Form.Field key={`rendered-mc-qtext-addchoiceInp-${props.qid}`}>
							<Label size="large">Enter Question Choice : </Label>
							<Input
								value={questionChoice} 
								onChange={(e,{value}) => setQuestionChoice(value)}
								labelPosition="right"
								type="text"
								placeholder="Type Choice.."
							>
								<input/>
								<Label
									onClick = { (e) => {
										if (questionChoice != ""){
											addChoice(questionChoice);
											setQuestionChoice("");
										}
									}}
									icon="add"
								>
								</Label>
							</Input>
						</Form.Field>
						{renderChoices()}
						<QuestionWeightFormFieldComponent options={questionWeights} onWeightUpdated={(weight) => setQuestionWeight(weight)} selectedWeight={questionWeight}/>
						<Form.Group>
							<Form.Button onClick={() => {
								if (questionText != ""){
									if (questionChoice != ""){
										addChoice(questionChoice);
									}
									setQuestionUpdatedId(questionUpdatedId+1);
								}else{
									setQtexterror(true);
									// console.log("questionText is empty")
								}
							}}>
								Save Question
							</Form.Button>
							<Form.Button onClick={() => {
								// if (questionChoice != "" || questionChoices.length > 0){
								// 	setQuestionText("");
								// 	setQuestionChoice("");
								// 	setQuestionChoices([]);
								// 	setQuestionWeight("");
								// }
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