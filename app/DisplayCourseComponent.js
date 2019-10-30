import React from 'react';
// import { parse } from 'csv-parse/lib/sync';
import { default as CreateNewCourseComponent} from "./CreateNewCourseComponent"
import { default as UpdateCourseComponent} from "./UpdateCourseComponent";
import { default as PickRosterFileComponent } from "./PickRosterFileComponent";
import { default as ErrorMessageComponent } from "./ErrorMessageComponent";

import { Button, Card, Image, Grid, GridRow, Segment, GridColumn } from 'semantic-ui-react'


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
					<Button basic color='green' onClick={() => props.setViewRosterClick("viewDownloadedRoster")}>
						View Roster
					</Button>
					<Button basic color='red' onClick={() => {
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
					<PickRosterFileComponent passSelectedFile={props.getRosterFile} />
				</div>
			</Card.Content>
		</Card>
	)
}


class DisplayCourseComponent extends React.Component {
	constructor(props){
		super(props)
		this.errorMessageRef = React.createRef();
		this.getRosterFile = this.getRosterFile.bind(this);
		this.setViewRosterRedirect = this.setViewRosterRedirect.bind(this);
		this.getCourses = this.getCourses.bind(this);
		this.state = {
				selectedFile: null,
				redirectTo:"courseDetails",
				errorMessageModalOpen:false,
				errorMessage:"",
				"courses":[],
				courseCards:undefined,
				"getCoursesRequestSucceeded":false
		}
	}

	getRosterFile(fileObj){
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
							}, () => {this.setState({redirectTo:"viewUploadedRoster"});console.log("Redirect set") });
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
					this.setState({errorMessage:`Error reading ${fileObj.name || "undefined"} file`, errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
				};
			})
		}catch(error){
			if (this.errorMessageRef && this.errorMessageRef.current) {
				console.log("Errormessagemodal exists")
				this.setState({errorMessage: error.message || (`Error reading ${fileObj.name || "undefined"} file`), errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
			}else{
				console.log("Errormessagemodal doesnt exist")
			};
			console.log(error)
		}
	}

	componentDidMount(){
		this.getCourses()
	}

	setViewRosterRedirect(str){
		console.log("Setting redirect to ", str)
		this.setState({redirectTo:str})
	}
	
	async getCourses(){
		console.log("getCourses called")
		let requestBody = {
			professor_id:1
		}

		try{
			console.log("Trying to fetch response")
			let response = await fetch("http://localhost:3000/professor/1/course",{
				method: 'POST',
				headers:{
					'Content-Type': 'application/json'
				},
				cache: 'no-cache',
				body: JSON.stringify(requestBody)
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
							setViewRosterClick={this.setViewRosterRedirect}
							getRosterFile={this.getRosterFile}
						/>
				);
			})
		}
		return cards;
	}


	render() {
		this.filePickerRef = React.createRef();
		console.log("this.state.redirectTo",this.state.redirectTo);
		if (this.state.redirectTo == "courseDetails"){
			return (
				<Grid>
					<Grid.Row columns={16}>
						<Card.Group itemsPerRow={4}>
							{this.state.courseCards || 
								(this.state.getCoursesRequestSucceeded && <NoCoursesCardComponent/>) || 
								(this.state.getCoursesRequestSucceeded == true && this.state.courseCards != undefined && this.state.courseCards.length == 0 && <NoCoursesCardComponent header={"You have not created a course yet!"} description={"Click on the Create new button below to create your new course."}/>) ||
								(!this.state.getCoursesRequestSucceeded && <NoCoursesCardComponent header={"Sorry! Courses could not be fetched"} description={"Please try refreshing the page or try again at a later time"}/>)}
						</Card.Group>
					</Grid.Row>
					<Grid.Row>
						<GridColumn width={6}/>
						<GridColumn width={4}>
							<CreateNewCourseComponent />
						</GridColumn>
						<GridColumn width={6}/>
					</Grid.Row>
					<ErrorMessageComponent ref={this.errorMessageRef} open={this.state.errorMessageModalOpen} errorMessage={this.state.errorMessage} closeModal={() => this.setState({errorMessageModalOpen:false})}/>
				</Grid>)
		}else if(this.state.redirectTo == "viewDownloadedRoster"){
			return <Redirect push={true} to="/professor/1/course/1/roster/9"/>
		}else if (this.state.redirectTo == "viewUploadedRoster"){
			// return <Redirect push={true} to="/professor/1/course/1/roster/9"/>
			return <Redirect push={true} to={{ pathname:"/professor/1/course/chooseroster/view", state : { header:this.state.fileHeaderFieldsArray, data:this.state.fileValueObjects}  }} />
		}else{
			return <Button fluid>No Value Set for this.state.redirectTo</Button>
		}
	}
}

export default DisplayCourseComponent;

// return (
// 		(this.state.redirectTo === "courseDetails" && (
// 			<Grid>
// 				{this.state.courseCards || <Segment>{"No Courses Found"}</Segment>}
// 				<Grid.Row>
// 						<CreateNewCourseComponent />
// 				</Grid.Row>
// 			</Grid>))
// 			||
// 		(this.state.redirectTo === "viewDownloadedRoster" && (
// 				<Redirect push={true} to="/professor/1/course/1/roster/9"/>
// 		))
// 			||
// 		(this.state.redirectTo === "viewUploadedRoster" && (
// 				<Redirect push={true} to={{ pathname:"/professor/1/course/chooseroster/view", state : { header:this.state.fileHeaderFieldsArray, data:this.state.fileValueObjects}  }} />
// 		))
// 		(<ErrorMessageComponent ref={this.errorMessageRef} open={this.state.errorMessageModalOpen} errorMessage={this.state.errorMessage} closeModal={() => this.setState({errorMessageModalOpen:false})}/>)    
// );