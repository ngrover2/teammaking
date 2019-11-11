import React from 'react'
import { Grid, Segment, Message, Header } from 'semantic-ui-react';

export default function GridRowMessageComponent () {
	return(
		<Grid.Row>
			<Message size="small" header={<Header>Please choose one of the following to create a new question of the appropriate question type</Header>}/>
		</Grid.Row>
	);
}