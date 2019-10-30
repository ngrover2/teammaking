import React from 'react';
import { useState } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import { Image, Header ,Segment ,Sidebar, Menu, Label, Icon, Button, Divider } from 'semantic-ui-react';
const linkLabelStyle = { 
	marginTop:"1rem",
	fontSize:"1.15rem"
}

const SidebarComponent = (props) => {
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
					<Link to="/professor/1/course">
						<Icon name='home'/>
						<div style = {linkLabelStyle}>Courses</div>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<Link to="/professor/1/course">
						<Icon name='sticky note'/>
						<div style = {linkLabelStyle}>Surveys</div>
					</Link>
				</Menu.Item>
			</Sidebar>
			<Sidebar.Pusher style={props.pushStyle}>
				{props.children}
			</Sidebar.Pusher>
		</Sidebar.Pushable>
	);
}

export default SidebarComponent;