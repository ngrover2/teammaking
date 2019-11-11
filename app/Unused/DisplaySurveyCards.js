// Component to display the survey cards.
import React from 'react';
// import { parse } from 'csv-parse/lib/sync';
import { default as CreateNewSurveyComponent} from "../Unused/CreateNewSurveyComponent"
import { default as ErrorMessageComponent } from "../Utils/ErrorMessageComponent";

import { Button, Card, Image, Grid, GridRow, Segment, GridColumn, Divider } from 'semantic-ui-react'


import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect
} from "react-router-dom";

const NoSurveyCardComponent = (props) => {
	return(
		<Card style = {{ minWidth:"400px"}}>
			<Card.Content>
				<Card.Header>{props.header || "No Surveys have been created for this course yet"}</Card.Header>
				<Card.Meta>{!props.header && "No Surveys"}</Card.Meta>
				<Card.Description>
						{props.description || "Click on create new Survey Button below to create your first survey for this Course!"}
				</Card.Description>
			</Card.Content>
		</Card>
	);
}

const SurveyCardComponent = (props) => {
	return(
		<Card style={{height:'250px'}} key={`${props.surveyCode}-card`}>
			<Card.Content>
				<Card.Header>{props.surveyName}</Card.Header>
				<Card.Meta>{props.surveyName}</Card.Meta>
				<Card.Description>
					{props.surveyDescription}
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<div className='ui four buttons'>
					<Button style={{ margin:"2px"}}
						basic 
						color='green' 
						onClick={
							// Not sure how to view survey questions on click
							() => props.setViewSurveyQuestionsClick("viewSurveyQuestions", props.courseId) 
						}
					>
						View Survey Questions
					</Button>
					<Button style={{ margin:"2px"}}
						basic 
						color='green' 
						onClick={
							// not sure how to go to new survey on click
							() => props.setNewSurveyClick("newSurvey", props.courseId)
						}
					>
						New Survey
					</Button>
					</div>
				
				<div style={{ textAlign:"center"}}><Button style={{ background:"none"}} onClick={(surveyId) => props.deleteSurvey(props.surveyId)}>Delete</Button></div>
			</Card.Content>
		</Card>
	)
}


class DisplaySurveyComponent extends React.Component {
	constructor(props){
		super(props)
		this.professor_id = props.match.params.pid;
		this.props = props;
		this.errorMessageRef = React.createRef();
		this.getSurveys = this.getSurveys.bind(this);
		this.deleteSurvey = this.deleteSurvey.bind(this);
		this.updatePage = this.updatePage.bind(this);
		this.state = {
				selectedFile: null,
				redirectTo:"sureyDetails",
				errorMessageModalOpen:false,
				errorMessage:"",
				courses:[],
				courseCards:undefined,
				getSurveysRequestSucceeded:false,
				selectedCourseId:0,
				selectedSurveyId:0
		}
	}

	
	componentDidMount(){
		if(this.props.match.params.pid){
			this.getCourses()
		}else{
			this.setState({
				getSurevysRequestSucceeded: false,
				errorMessage: "Could not ascertain the Course identity from the url",
				errorMessageModalOpen:true
			})
			console.log("course id is undefined or false", this.props)
		}
	}

	// needs updating. not sure how to adapt from display course to display survey
	// componentWillUpdate(){
	// 	if(this.props.match.params.pid){
	// 		this.getCourses()
	// 	}else{
	// 		this.setState({
	// 			getCoursesRequestSucceeded: false,
	// 			errorMessage: "Could not fetch courses",
	// 			errorMessageModalOpen:true
	// 		})
	// 	}
	// }

	updatePage(){
		this.getCourses();
	}

	async deleteSurvey(surveyId){
		console.log("delete survey called")

		try{
			console.log("Trying to fetch response")
			let response = await fetch(`http://localhost:3000/professor/${this.professor_id}/course/${courseId}/survey/${surveyID}/delete`,{
				method: 'DELETE',
				headers:{
					'Content-Type': 'application/json'
				},
				cache: 'no-cache'
			})
			if (response) {console.log("response received")} else {console.log("response received", response)}
			let responseJson = await response.json()
			if (responseJson){
				console.log("response json parsed")
				if (responseJson.status == "ok"){
					console.log("response status ok")
					this.getCourses();
				}else{
					this.setState({
						errorMessage:"Could not delete survey at this time" + responseJson.error ? responseJson.error : "Error cause unknown",
						errorMessageModalOpen:true
					})
				}
			}
		}catch(error){
			this.setState({
				errorMessage:`Error occurred while trying to delete the survey.\n${error.message}`,
				errorMessageModalOpen:true
			})
		}
	}

	setViewSurveyRedirect(str, courseId, surveyId){
		console.log("Setting redirect to ", str)
		this.setState({
			selectedCourseId:courseId,
			selectedSurveyId:surveyId
		},()=> this.setState({
				redirectTo:str
			})
		);
	}
	
	async getSurveys(){
		console.log("getSurveys called")

		try{
			console.log("Trying to fetch response")
			let response = await fetch(`http://localhost:3000/professor/${this.professor_id}/course/${this.course_id}/survey`,{
				method: 'POST',
				headers:{
					'Content-Type': 'application/json'
				},
				cache: 'no-cache'
			})
			if (response) {console.log("response received")} else {console.log("response received", response)}
			let responseJson = await response.json()
			if (responseJson){
				console.log("response json parsed")
				if (responseJson.status == "ok"){
					console.log("response status ok")
					if (responseJson.result){
						if (responseJson.result.length > 0){
							this.setState({
								courses:responseJson.result
							}, () => this.setState({
									getCoursesRequestSucceeded:true,
									courseCards: this.constructCards()
								})
							)
						}else{
							this.setState({
								getCoursesRequestSucceeded:true,
								errorMessage:"No survey found. You probably have not created any surveys for this course yet.",
								errorMessageModalOpen:true
							})	
						}
					}else{
						this.setState({
							getCoursesRequestSucceeded:false,
							errorMessage:"No surveys found. You probably have not created any surveys for this course yet.",
							errorMessageModalOpen:true
						})	
					}
				}else{
					this.setState({
						getCoursesRequestSucceeded:false,
						errorMessage:"Could not fetch surveys at this time" + responseJson.error ? responseJson.error : "Error cause unknown",
						errorMessageModalOpen:true
					})
				}
			}
		}catch(error){
			this.setState({
				getCoursesRequestSucceeded:false,
				errorMessage:`Error occurred while fetching surveys.\n${error.message}`,
				errorMessageModalOpen:true
			})
		}
	}

	constructCards(){
		console.log("constructCards called")
		let cards = []
		if (this.state.surveys){
			console.log("Creating surveyCards")
			this.state.surveys.forEach((surveyObj, idx)=>{
				cards.push(
						<CourseCardComponent 
							key={`${surveyObj.course_id}-row`}
							professorId={this.professor_id}
							courseId={surveyObj.course_id}
							surveyName={surveyObj.survey_name}
							surveyDescription={surveyObj.survey_desc}
							Deadline={surveyObj.deadline}
							surveyId={surveyObj.survey_id}
							setViewSurveyQuestionsClick={this.setViewSurveyQuestionsRedirect}
							deleteSurvey={this.deleteSurvey}
						/>
				);
			})
		}
		return cards;
	}


	render() {
		console.log("this.professor_id",this.professor_id)
		console.log("this.props",this.props)
		this.filePickerRef = React.createRef();
		console.log("this.state.redirectTo",this.state.redirectTo);
		if (this.state.redirectTo == "surveyDetails"){
			return (
				<Grid>
					<Grid.Row columns={16}>
						<Card.Group itemsPerRow={4} style={{ width:"inherit"}}>
							{this.state.surveyCards || 
								(this.state.getSurveysRequestSucceeded && <NoSurveysCardComponent/>) || 
								(this.state.getSurveysRequestSucceeded == true && this.state.surveyCards != undefined && this.state.surveyCards.length == 0 && <NoSurveysCardComponent header={"You have not created a survey for this course yet!"} description={"Click on the Create new button below to create your new survey for this course."}/>) ||
								(!this.state.getSurveysRequestSucceeded && <NoSurveysCardComponent header={"Sorry! Surveys could not be fetched"} description={"Please try refreshing the page or try again at a later time"}/>)}
						</Card.Group>
					</Grid.Row>
					<Grid.Row>
						<GridColumn width={6}/>
						<GridColumn width={4}>
							<CreateNewSurveyComponent pid={this.props.match.params.pid} onCreated={this.updatePage}/>
						</GridColumn>
						<GridColumn width={6}/>
					</Grid.Row>
					<ErrorMessageComponent ref={this.errorMessageRef} open={this.state.errorMessageModalOpen} errorMessage={this.state.errorMessage} closeModal={() => this.setState({errorMessageModalOpen:false})}/>
				</Grid>)
		}else if(this.state.redirectTo == "viewSurveyQuestions"){
			// Not sure about this redirect for view surveys button
			return <Redirect push={true} to={`/professor/${this.professor_id}/course/${this.state.selectedCourseId}/surveys`}/>
		}else if(this.state.redirectTo == "newSurvey"){
			// not sure about this redirect for new survey button
			return <Redirect push={true} to={`/professor/${this.professor_id}/course/${this.state.selectedCourseId}/surveys/newSurvey`}/>
		}else{
			return <Button fluid>No Value Set for this.state.redirectTo</Button>
		}
	}
}

export default DisplaySurveyComponent;