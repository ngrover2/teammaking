import React from 'react';
import { useState, useEffect } from 'react'
import { Form, Label, Grid, Message, Segment, Button, Checkbox, Icon, Header, Input } from 'semantic-ui-react';
import { QuestionWeightFormFieldComponent, questionWeights } from "../../Utils/UtilComponents";


const RenderedMulValuesQuestionComponent = (props) => {
	
	const [ questionText, setQuestionText ] = useState(props.qtext); // Question Text
	const [ questionWeight, setQuestionWeight ] = useState(props.qweight); // Question Weight
	const [ maxNumValues, setMaxNumValues ] = useState(props.qMaxNumValues); // Max no of answer values
	const [ maxValuesReached, setMaxValuesReached ] = useState(false); // Max no of answer values
	const [ newAnswerValue, setNewAnswerValue ] = useState(""); // New Answer Value being input by the responser
	
	// 	const [ questionObj, setQuestionObj ] = useState({
	// 	qtype: props.qtype,
	// 	qid: props.qid,
	// 	qtext: props.qtext,
	// 	qMaxVals: props.qMaxNumValues
	// })
	
	const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0); // Keeps track of question's state in the local copy of the object - `questionObj`
	const [ answerValues, setAnswerValues ] = useState([]); // All Answer Values entered by the responser so far for this question
	const [ questionEditable, setQuestionEditable ]  = useState(false); // whether the question is editable by the professor
	// const [ questionObjUpdatedId, setQuestionObjUpdatedId ] = useState(0); // tracks when to inform the parent component to rerender the question as per its new state

	useEffect(() => {
		// console.log("received props in RenderedMulValuesQuestionComponent", props);
		if (questionUpdatedId == 0) return
		let updatedQObj = Object.assign({},{
			qid: props.qid,
			qtype: props.qtype,
			qtext: questionText,
			qweight: questionWeight,
			qMaxVals: maxNumValues
		});
		// console.log("Will update questionObject to", updatedQObj); //DEBUG
		props.onQuestionUpdated(updatedQObj);
	},[questionUpdatedId])

	useEffect(() => {
		setQuestionText(props.qtext);
		setQuestionWeight(props.qweight);
		setMaxNumValues(props.qMaxNumValues);
		setMaxValuesReached(false);
		changeMaxReachedMessageVisibility();
	},[props.qid])

	useEffect(() => {
		changeMaxReachedMessageVisibility();
		// remove values from answerValues array if its length exceeds the newly set `props.qMaxNumValues`
		setAnswerValues(answerValues.slice(0,props.qMaxNumValues));
	},[answerValues.length,props.qMaxNumValues])

	function removeValue(valueId){
		// console.log(`${valueId} to be deleted`) // DEBUG
		setAnswerValues([
			...answerValues.slice(0, valueId),
			...answerValues.slice(valueId+1, answerValues.length),
		]);
	}

	function addValue(valueText){
		// console.log("answerValues", answerValues);
		if (!(answerValues.length >= maxNumValues)){
			let isDuplicate = answerValues.filter((v) => v == valueText).length > 0;
			isDuplicate ? undefined : setAnswerValues([
											...answerValues.slice(0),
											valueText
										]);
		}
		setNewAnswerValue("");
	}

	function changeMaxReachedMessageVisibility(){
		if (answerValues.length >= props.qMaxNumValues){
			console.log(`answerValues.length is ${answerValues.length}, changing message visbility to true`);
			setMaxValuesReached(true);
		}else{
			console.log(`answerValues.length is ${answerValues.length}, changing message visbility to false`);
			setMaxValuesReached(false);
		}
	}

	const renderValues = () => {
		let values = []
		
		if (answerValues && answerValues.length > 0){
			answerValues.forEach((v,i)=>{
				// console.log("value: ",v);
				values.push(
					<Form.Group key={`mvals-Q-${props.qid || -1}-val-${i}`} style={{ alignItems:"center"}}>
						<Form.Field
							key={`val-${i}`}	
						>
							<Label size="large">{v}</Label>
						</Form.Field>
						<Form.Button key={`remove-val-${i}`} icon="remove" size="mini"
							onClick={() => {removeValue(i)}}
						>
						</Form.Button>
					</Form.Group>
				)
			});
		}
		else{
			
			// values.push(<Message key={`mc-Q-${props.qid || -1}-no-choices`} size="tiny"><Header>You have not entered any values yet</Header></Message>)
		}
		if (values.length>0) return values;
	}

	function renderedQuestionText(){
		if (questionEditable == false){
			return [
				<Form.Field key={`rendered-mvals-qtext-${props.qid}-field-noedit`}>
					<Header>{`Question #${props.qseqno+1}: ${questionText}`}</Header>
				</Form.Field>
			]
		}else{
			return [
				<Form.Field key={`rendered-mvals-qtext-${props.qid}-field-edit`}>
					<Input value={questionText} onChange={(e) => setQuestionText(e.target.value)} label="Enter question text"></Input>
				</Form.Field>
			]
		}
	}

	const renderValuesWithMessage = () => {
		return [
			<Form.Field key={`mvals-Q-${props.qid || -1}-num-choices-message`}>
				<Message size="tiny">{answerValues.length > 0 ? `You have entered the following ${answerValues.length} values` : `You have not entered any values yet`}</Message>
			</Form.Field>,
			renderValues()
		]
	}

	return [
		<Grid.Row columns={12} key={`rendered-mvals-${props.qid}`}>
			<Grid.Column width={16}>
				<Segment className="fullwidth">
					<Form error key={`rendered-mvals-${props.qid}-form`}>
						{renderedQuestionText()}
						{
							!questionEditable &&
								renderValuesWithMessage()
						}
						{!questionEditable &&
							<Form.Field key={`rendered-mvals-qtext-addchoiceInp-${props.qid}`}>
								<Input 
									value={newAnswerValue} 
									onChange={(e,{value}) => setNewAnswerValue(value)} 
									labelPosition="right" 
									type="text"
									placeholder="Type Choice.."
								>
									<Label>Enter Value</Label>
									<input/>
									<Label
										onClick = { (e) => {
											if (newAnswerValue != ""){
												addValue(newAnswerValue);
												setNewAnswerValue("");
											}
										}}
										icon="add"
									>
									</Label>
								</Input>
							</Form.Field>
						}
						{
							!questionEditable && maxValuesReached && (maxNumValues != 0) && (maxNumValues != null) &&
							<Form.Field key={`rendered-mvals-${props.qid}-msg-max-vals-reached`}>
								<Message size="small" error={true}>{`You can not enter more than ${props.qMaxNumValues} values`}</Message>
							</Form.Field>
							
						}
						{questionEditable &&	
							<Form.Select
								key={`rendered-mvals-${props.qid}-select-max-vals`}
								options={[1,2,3,4,5,6,7,8,9,10].map((v,i)=> Object.assign({},{key:i,value:v,text:v}))}
								onChange={(e,{value}) => {
									console.log(`changing maxNumValues to ${value}`);
									setMaxNumValues(value);
								}}
								value={maxNumValues}
								label={<Label size="large">Select number of values that can be added</Label>}
							>
							</Form.Select>}
						{questionEditable &&	
							<QuestionWeightFormFieldComponent options={questionWeights} onWeightUpdated={(weight) => setQuestionWeight(weight)} selectedWeight={questionWeight}/>
						}
						<Form.Group>
							<Form.Button onClick={() => {
								if (questionEditable){
									if (newAnswerValue!="") addValue(newAnswerValue);
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

export default RenderedMulValuesQuestionComponent;