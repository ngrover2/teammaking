import React from 'react';
import { useState, useEffect } from 'react';
import { Link, Route, useParams } from 'react-router-dom'
import { Grid, Icon, Segment, Button, SegmentGroup, GridRow, GridColumn } from 'semantic-ui-react'

const AppHeaderComponent = (props) => {

	const [ sidebarOpen, setSidebarOpen ] = useState(false);
	const  { pid } = useParams();

	useEffect(() => {
		props.setSidebarVisible(sidebarOpen);
	}, [sidebarOpen]);


	const headerStyle = {
		backgroundColor:"black",
	}

	const buttonStyle = {
		color:"white",
		fontSize:"1rem",
		backgroundColor:"black",
		height:"inherit",
		display:"inherit",
	}
	const hamburgerButtonStyle = {
		height:"inherit",
		display:"inherit",
		marginLeft:"40px"
	}

	const HeaderLinkButton = (props) => <Link to={props.to}><Button style={buttonStyle}>{props.name}</Button></Link>
	const HeaderSegment = (props) => <Segment style={headerStyle}>{props.children}</Segment>
	return(
		<Grid horizontal={"true"} columns={16} style={headerStyle}>
			<GridRow style={{alignItems:"center"}}>
				<GridColumn width={2}>
					<Button icon="bars" inverted onClick={() => setSidebarOpen(!sidebarOpen)} style={hamburgerButtonStyle}/>
				</GridColumn>
				<GridColumn width={4}>
					<HeaderLinkButton to={`/professor/${pid || props.pid}/course`} name="Courses" style={buttonStyle}/>
				</GridColumn>
				<GridColumn width={4}>
					<HeaderLinkButton to={`/professor/${pid || props.pid}/survey`} name="Surveys"/>
				</GridColumn>
				<GridColumn width={3}>
					<HeaderLinkButton to="/duh" name="Etc"/>
				</GridColumn>
				<GridColumn width={3}>
					<HeaderLinkButton to="/duh" name="Etc"/>
				</GridColumn>
			</GridRow>
		</Grid>
	);
};

export default AppHeaderComponent;