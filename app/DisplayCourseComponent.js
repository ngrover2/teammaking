// Component to display the course cards.
import React from 'react';
// import { parse } from 'csv-parse/lib/sync';
import { default as CreateNewCourseComponent} from "./CreateNewCourseComponent"
import { default as UpdateCourseComponent} from "./UpdateCourseComponent";
import { default as PickRosterFileComponent } from "./PickRosterFileComponent";
import { default as ErrorMessageComponent } from "./ErrorMessageComponent";

import { Button, Card, Image, Grid, GridRow, Segment, GridColumn, Divider } from 'semantic-ui-react'


import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect
} from "react-router-dom";

const NoCoursesCardComponent = (props) => {
	return(
		<Card style = {{ minWidth:"400px"}}>
			<Card.Content>
				<Card.Header>{props.header || "No course defined yet"}</Card.Header>
				<Card.Meta>{!props.header && "No Courses"}</Card.Meta>
				<Card.Description>
						{props.description || "Click on create new Course Button below to create your first course!"}
				</Card.Description>
			</Card.Content>
		</Card>
	);
}

const CourseCardComponent = (props) => {
	return(
		<Card style={{height:'250px'}} key={`${props.courseCode}-card`}>
			<Card.Content>
				<UpdateCourseComponent
					{...props}
				/>
				<Card.Header>{props.courseName}</Card.Header>
				<Card.Meta>{props.courseCode}</Card.Meta>
				<Card.Description>
					{props.courseDescription}
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<div className='ui two buttons'>
					<Button style={{ margin:"2px"}}
						basic 
						color='green' 
						onClick={
							() => props.setViewRosterClick("viewDownloadedRoster", props.courseId, props.rosterId)
						}
					>
						View Roster
					</Button>
					<Button style={{ margin:"2px"}}
						basic 
						color='red' 
						onClick={() => {
							if (document.getElementById("hiddenFilePickerButtonId") != "undefined"){
								var fp = document.getElementById("hiddenFilePickerButtonId");
								fp.click();
							}else{
								console.log("fp is undefined");
							}
						}
					}>
						Import Roster
					</Button>
					<PickRosterFileComponent passSelectedFile={(fileObj) => props.getRosterFile(fileObj, props.courseId)} />
				</div>
				
				<div style={{ textAlign:"center"}}><Button style={{ background:"none"}} onClick={(courseId) => props.deleteCourse(props.courseId)}>Delete</Button></div>
			</Card.Content>
		</Card>
	)
}


class DisplayCourseComponent extends React.Component {
	constructor(props){
		super(props)
		this.professor_id = props.match.params.pid;
		this.props = props;
		this.errorMessageRef = React.createRef();
		this.getRosterFile = this.getRosterFile.bind(this);
		this.setViewRosterRedirect = this.setViewRosterRedirect.bind(this);
		this.getCourses = this.getCourses.bind(this);
		this.deleteCourse = this.deleteCourse.bind(this);
		this.updatePage = this.updatePage.bind(this);
		this.state = {
				selectedFile: null,
				redirectTo:"courseDetails",
				errorMessageModalOpen:false,
				errorMessage:"",
				courses:[],
				courseCards:undefined,
				getCoursesRequestSucceeded:false,
				selectedCourseId:0,
				selectedRosterId:0
		}
	}

	getRosterFile(fileObj, courseId){
		if (fileObj) this.setState({selectedFile:fileObj.name}, () => console.log(`Selected: ${fileObj.name}`));
		let fileReader = new FileReader();
		try{
			var dataArray = [];
			fileReader.readAsText(fileObj)
			
			fileReader.onload = ((e) => {
				try{
					var data = fileReader.result
					if (data) dataArray = data.match(/[^\r\n]+/g);
					if (dataArray instanceof Array) {
						let headerSplitLength = 0;
						let valueObjectSplitLength = 0;
						// get the first row of csv as header using Array.splice() which would remove the first row from data.
						let headerString = dataArray.splice(0,1);
						let headerFields = headerString[0].split(",");
						headerSplitLength = headerFields.length

						// construct value objects from rest of the data
						let valueObjects = []
						dataArray.forEach((value,idx)=>{
							let valueObj = {}
							value.split(",").forEach((splitVal,splitIdx)=> {
								valueObj[headerFields[splitIdx]] = splitVal
								if (!idx) valueObjectSplitLength = valueObjectSplitLength + 1
							})
							valueObjects.push(valueObj);
						});

						// console.log("header", headerFields);
						// console.log("values", valueObjects)

						if (headerSplitLength == valueObjectSplitLength){
							this.setState({
								fileHeaderFieldsArray:headerFields,
								fileValueObjects:valueObjects
							}, () => {this.setState({
												selectedCourseId:courseId
										}, () => this.setState({redirectTo:"viewUploadedRoster"}))
									}
							);
						}else{
							// this.setState({errorMessage: `HeaderLength:${headerSplitLength} while data length: ${valueObjectSplitLength}`, errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
							// this.setState({
							//   fileHeaderFieldsArray:[],
							//   fileValueObjects:[]
							// }, () => this.setState({redirectTo:"viewUploadedRoster"}) );
							this.setState({errorMessage: `The file does not appear to be a valid csv file`, errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
						}
					}else{
						console.log(error)
						this.setState({errorMessage: "The selected file does not have data in the right format", errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
					};
				}catch(error){
					throw error;
				}
			})
			fileReader.onerror = ((e) => {
				if (this.errorMessageRef && this.errorMessageRef.current) {
					this.setState({errorMessage:`Error reading ${fileObj.name || "undefined" } file`, errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
				};
			})
		}catch(error){
			if (this.errorMessageRef && this.errorMessageRef.current) {
				// console.log("Errormessagemodal exists") // DEBUG
				this.setState({errorMessage: error.message || (`Error reading ${fileObj.name || "undefined"} file`), errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
			}else{
				console.log("Errormessagemodal doesnt exist")
			};
			console.log(error)
		}
	}

	componentDidMount(){
		if(this.props.match.params.pid){
			this.getCourses()
		}else{
			this.setState({
				getCoursesRequestSucceeded: false,
				errorMessage: "Could not ascertain the professor identity from the url",
				errorMessageModalOpen:true
			})
			console.log("professor id is undefined or falsy", this.props)
		}
	}

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

	async deleteCourse(courseId){
		console.log("delete course called")

		try{
			console.log("Trying to fetch response")
			let response = await fetch(`http://localhost:3000/professor/${this.professor_id}/course/${courseId}/delete`,{
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
						errorMessage:"Could not delete course at this time" + responseJson.error ? responseJson.error : "Error cause unknown",
						errorMessageModalOpen:true
					})
				}
			}
		}catch(error){
			this.setState({
				errorMessage:`Error occurred while trying to delete the course.\n${error.message}`,
				errorMessageModalOpen:true
			})
		}
	}

	setViewRosterRedirect(str, courseId, rosterId){
		console.log("Setting redirect to ", str)
		this.setState({
			selectedCourseId:courseId,
			selectedRosterId:rosterId
		},()=> this.setState({
				redirectTo:str
			})
		);
	}
	
	async getCourses(){
		console.log("getCourses called")

		try{
			console.log("Trying to fetch response")
			let response = await fetch(`http://localhost:3000/professor/${this.professor_id}/course`,{
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
								errorMessage:"No courses found. You probably have not created any courses yet.",
								errorMessageModalOpen:true
							})	
						}
					}else{
						this.setState({
							getCoursesRequestSucceeded:false,
							errorMessage:"No courses found. You probably have not created any courses yet.",
							errorMessageModalOpen:true
						})	
					}
				}else{
					this.setState({
						getCoursesRequestSucceeded:false,
						errorMessage:"Could not fetch courses at this time" + responseJson.error ? responseJson.error : "Error cause unknown",
						errorMessageModalOpen:true
					})
				}
			}
		}catch(error){
			this.setState({
				getCoursesRequestSucceeded:false,
				errorMessage:`Error occurred while fetching courses.\n${error.message}`,
				errorMessageModalOpen:true
			})
		}
	}

	constructCards(){
		console.log("constructCards called")
		let cards = []
		if (this.state.courses){
			console.log("Creating courseCards")
			this.state.courses.forEach((courseObj, idx)=>{
				cards.push(
						<CourseCardComponent 
							key={`${courseObj.course_id}-row`}
							professorId={this.professor_id}
							courseCode={courseObj.course_code}
							courseName={courseObj.course_name}
							courseDescription={courseObj.course_desc}
							startDate={courseObj.start_date}
							endDate={courseObj.end_date}
							classStartTime={courseObj.timings_start}
							classEndTime={courseObj.timings_end}
							courseId={courseObj.course_id}
							tAEmail={courseObj.ta_email}
							tAName={courseObj.ta_name}
							rosterId={courseObj.roster_id}
							setViewRosterClick={this.setViewRosterRedirect}
							getRosterFile={this.getRosterFile}
							deleteCourse={this.deleteCourse}
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
		if (this.state.redirectTo == "courseDetails"){
			return (
				<Grid>
					<Grid.Row columns={16}>
						<Card.Group itemsPerRow={4} style={{ width:"inherit"}}>
							{this.state.courseCards || 
								(this.state.getCoursesRequestSucceeded && <NoCoursesCardComponent/>) || 
								(this.state.getCoursesRequestSucceeded == true && this.state.courseCards != undefined && this.state.courseCards.length == 0 && <NoCoursesCardComponent header={"You have not created a course yet!"} description={"Click on the Create new button below to create your new course."}/>) ||
								(!this.state.getCoursesRequestSucceeded && <NoCoursesCardComponent header={"Sorry! Courses could not be fetched"} description={"Please try refreshing the page or try again at a later time"}/>)}
						</Card.Group>
					</Grid.Row>
					<Grid.Row>
						<GridColumn width={6}/>
						<GridColumn width={4}>
							<CreateNewCourseComponent pid={this.props.match.params.pid} onCreated={this.updatePage}/>
						</GridColumn>
						<GridColumn width={6}/>
					</Grid.Row>
					<ErrorMessageComponent ref={this.errorMessageRef} open={this.state.errorMessageModalOpen} errorMessage={this.state.errorMessage} closeModal={() => this.setState({errorMessageModalOpen:false})}/>
				</Grid>)
		}else if(this.state.redirectTo == "viewDownloadedRoster"){
			return <Redirect push={true} to={`/professor/${this.professor_id}/course/${this.state.selectedCourseId}/roster/${this.state.selectedRosterId}`}/>
		}else if (this.state.redirectTo == "viewUploadedRoster"){
			return <Redirect push={true} to={{ pathname:`/professor/${this.professor_id}/course/${this.state.selectedCourseId}/chooseroster/view`, state : { header:this.state.fileHeaderFieldsArray, data:this.state.fileValueObjects}  }} />
		}else{
			return <Button fluid>No Value Set for this.state.redirectTo</Button>
		}
	}
}

export default DisplayCourseComponent;