import React from 'react'
import { useState, useEffect } from 'react'
import { Radio, Grid, Label, Button, Container, Message, Header, Divider } from 'semantic-ui-react';
import { FullWidthDivider, GridRowMessageComponent } from "../Utils/UtilComponents";

const Labelled = (props) => {
	return (
		<Grid.Row width={16}>
				You have selected: <Label>{props.selected || "None"}</Label>
		</Grid.Row>
	);
}

const SelectQuestionType = (props) => {
	const [ selected, setSelected ] = useState(props.selectedWeight);

	useEffect(() => {
		props.readyAddNewQuestion(selected)
	},[selected])

	return[
			<GridRowMessageComponent key={`choices-message`} message={"Please choose one of the following to create a new question of the appropriate question type"}/>,
			<Grid.Row columns={16} key={`choices`}>
				<Grid.Column width={3}>
					<div>
						<Radio
							value="text"
							checked={selected === "text"}
							onChange={((e, { value } ) => { setSelected(value) } )}
						/>
						<Label pointing="left">Text</Label>
					</div>
				</Grid.Column>
				<Grid.Column width={3}>
					<div>
						<Radio
							value="singlechoice"
							checked={selected === "singlechoice"}
							onChange={((e, { value } ) => { setSelected(value) } )}
						/>
						<Label pointing="left">Single Choice</Label>
					</div>
				</Grid.Column>
				<Grid.Column width={3}>
					<div>
						<Radio
							value="multiplechoice"
							checked={selected === "multiplechoice"}
							onChange={((e, { value } ) => { setSelected(value) } )}
						/>
						<Label pointing="left">Multiple Choice</Label>
					</div>
				</Grid.Column>
				<Grid.Column width={3}>
					<div>
						<Radio
							value="multiplevalues"
							checked={selected === "multiplevalues"}
							onChange={((e, { value } ) => { setSelected(value) } )}
						/>
						<Label pointing="left">Multiple Values</Label>
					</div>
				</Grid.Column>
				{
					/*<Grid.Column width={3}>
						<div>
							<Radio
								value="schedule"
								checked={selected === "schedule"}
								onChange={((e, { value } ) => { setSelected(value) } )}
							/>
							<Label pointing="left">Schedule</Label>
						</div>
					</Grid.Column>*/
				}
			</Grid.Row>,
			<Grid.Row columns={16} key={`selected-choice-label`}>
				<Grid.Column width={16}>
					<Message size="mini" header={<Header>You selected: <Label color="green">{(selected && selected!= "") ? selected : "None"}</Label></Header>}></Message>
				</Grid.Column>
			</Grid.Row>,
			<Grid.Row key={`divider-after-choices`}>
				<Grid.Column width={16}>
					<FullWidthDivider/>
				</Grid.Column>
			</Grid.Row>
	];
}

export default SelectQuestionType;