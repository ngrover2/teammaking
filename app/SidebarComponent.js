// Component for popout sidebar.
import React from 'react';
import { useState } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useParams
} from "react-router-dom";
import { Image, Header ,Segment ,Sidebar, Menu, Label, Icon, Button, Divider } from 'semantic-ui-react';
const linkLabelStyle = { 
	marginTop:"1rem",
	fontSize:"1.15rem"
}

const SidebarComponent = (props) => {

	const { pid } = useParams()
	return(
		<Sidebar.Pushable as={Segment}>
			<Sidebar
				as={Menu}
				animation='scale down'
				icon='labeled'
				inverted
				vertical
				visible={props.visible}
				width='thin'
			>
				<Menu.Item>
					<Link to={`/professor/${pid || props.pid}/course`}>
						<Icon name='home'/>
						<div style = {linkLabelStyle}>Courses</div>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<Link to={`/respond/1`}>
						<Icon name='sticky note'/>
						<div style = {linkLabelStyle}>Respond</div>
					</Link>
				</Menu.Item>
				{
					// Add appropriate Links in the future
					/*<Menu.Item>
						<Link to={`/professor/${pid || props.pid}/course`}>
							<Icon name='sticky note'/>
							<div style = {linkLabelStyle}>Surveys</div>
						</Link>
					</Menu.Item>*/
				}
			</Sidebar>
			<Sidebar.Pusher style={props.pushStyle}>
				{props.children}
			</Sidebar.Pusher>
		</Sidebar.Pushable>
	);
}

export default SidebarComponent;