import React from 'react'
import { Segment, Message, SegmentGroup, Header, MessageContent, Button } from 'semantic-ui-react'

const LoaderSegmentComponent = (props) => {
	return (
		<SegmentGroup>
			<Segment style={{minHeight:"100px"}}>
				<Message style={{textAlign:"center"}}>
					<Header>
						Loading {`${props.message || "content"}...` }		
					</Header>
					<MessageContent style={{marginLeft:"-2rem"}}>
						<Button loading></Button>
						Please wait
					</MessageContent>
				</Message>
			</Segment>
		</SegmentGroup>
	);
}

export default LoaderSegmentComponent;