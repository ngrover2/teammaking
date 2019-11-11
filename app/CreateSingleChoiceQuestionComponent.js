import React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Input, Label, Segment, Button, Form, Message, Header } from 'semantic-ui-react';
import { QuestionWeightFormFieldComponent, questionWeights, qtypeToReadableMapping } from "./UtilComponents";
import { userInfo } from 'os';

export default function CreateSingleChoiceQuestionComponent(props){
	const [ questionText, setQuestionText ] = useState(""); // Tracks local changes to question Text via the 'Enter Question Text' input box
	const [ questionChoice, setQuestionChoice ] = useState(""); // Tracks local changes to answer choice being added via the 'Enter Question choice' input box
	const [ questionWeight, setQuestionWeight ] = useState(""); // Tracks local changes to question weight selected via the 'Select weight' radio button group
	const [ questionChoices, setQuestionChoices ] = useState([]); // Keeps copy of all answer choices that have been added so far, even from the edit button in RenderedMCQuestionComponent
	const [ selectedChoice, setSelectedChoice ] = useState(null);
	const [ selectedAsDefaultChoice, setSelectedAsDefaultChoice ] = useState(false);
	const [ qtexterror, setQtexterror ] = useState(false);
	const [ clearInputsId, setClearInputsId ] = useState(0);
	
	const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0);
	const [ questionObject, setQuestionObject ] = useState({
		qtext: "",
		qid: props.qid,
		qtype: props.qtype,
		qweight: "",
		choices: "",
		defaultChoice: selectedAsDefaultChoice == true ? selectedChoice : null,
		defaultSelected: selectedAsDefaultChoice
	});

	const [ questionObjectUpdatedId, setQuestionObjectUpdatedId ] = useState(0);

	useEffect(() => {
		setQuestionText("");
		setQuestionChoice("");
		setQuestionWeight("");
		setQuestionChoices([]);
		setSelectedChoice("");
	},[props.qid]);

    useEffect(() => {
		if (questionUpdatedId == 0) return
		let updatedQuestionObj = Object.assign({},questionObject,{
			qid: props.qid,
			qtext:questionText,
			choices: questionChoices,
			qweight: questionWeight,
			defaultChoice: selectedAsDefaultChoice == true ? selectedChoice : null,
			defaultSelected: selectedAsDefaultChoice
		});
		setQuestionObject(updatedQuestionObj);
		setQuestionObjectUpdatedId(questionObjectUpdatedId+1);
	},[questionUpdatedId])
	

	useEffect(() => {
		if (questionObjectUpdatedId == 0) return
		props.setNewQuestionId();
		props.onQuestionUpdated(questionObject);
	},[questionObjectUpdatedId])

	function removeChoice(valueId){
		// console.log(`${valueId} to be deleted`) // DEBUG
		setQuestionChoices([
			...questionChoices.slice(0, valueId),
			...questionChoices.slice(valueId+1, questionChoices.length),
		]);
	}

	useEffect(() => {
		setQuestionText("");
		setQuestionChoice("");
		setQuestionWeight("");
		setQuestionChoices([]);
		setSelectedChoice("");
		setSelectedAsDefaultChoice(false);
	},[clearInputsId]);	

	function addChoice(valueText){
		let isDuplicate = questionChoices.filter((v) => v == valueText).length > 0;
		isDuplicate ? undefined : setQuestionChoices([
										...questionChoices.slice(0),
										valueText
									]);
		setQuestionChoice("");
	}

	const renderChoices = () => {
		let values = []
		if (questionChoices && questionChoices.length > 0){
			questionChoices.forEach((v,i) => {
				values.push(
					<Form.Group key={`mc-Q-${props.qid || -1}-choice-${i}`} style={{ alignItems:"center"}} >
						<Form.Radio
							label={v}
							key={i}
							checked={selectedChoice == v}
							onChange={(e,{label}) => {
								console.log("selected choice: ", label);
								setSelectedChoice(label)
							}}
						>
						</Form.Radio>
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
							<input  placeholder="Type Question Text.." value={questionText} onChange={(e) => {
								if (questionText != ""){
									if (qtexterror == true) {
										setQtexterror(false);
									}
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
						<Form.Checkbox
							label="Use selected value as the default choice"
							onChange={(e, {checked}) => setSelectedAsDefaultChoice(checked)}
						>
						</Form.Checkbox>
						<QuestionWeightFormFieldComponent options={questionWeights} onWeightUpdated={(weight) => setQuestionWeight(weight)} selectedWeight={questionWeight}/>
						<Form.Group>
							<Form.Button onClick={() => {
								if (questionText != ""){
									if (questionChoice != ""){
										addChoice(questionChoice);
									};
									setQuestionUpdatedId(questionUpdatedId+1);
								}else{
									setQtexterror(true);
									// console.log("but questionText is empty")
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