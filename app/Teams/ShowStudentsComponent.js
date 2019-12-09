import React from "react"
import { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { Grid, Message, Segment, Label, Button, GridRow, GridColumn } from 'semantic-ui-react'
import { default as ErrorMessageComponent } from '../../app/Utils/ErrorMessageComponent';


const ShowStudentCompatibilityScoresComponent = (props) => {
	const [ fetchScoresId ] = useState(0);
	const [ receivedScores, setReceivedScores ] = useState({}); 
	const [ errorMessageModalOpen, setErrorMessageModalOpen ] = useState(false);
	const [ message, setMessage ] = useState("");
	const [ retryId, setRetryId ] = useState(0);
	const maxRetries = 1;

	const [ perQuestionStats, setPerQuestionStats ] = useState({});
	const [ studentsOriginalAnswers, setStudentsOriginalAnswers ] = useState({});

	useEffect(() => {
		async function fetchScores(){
			let postBody = {
				
			}

			let fetchedScores = await fetch(`http://localhost:3000/professor/1/course/1/survey/1/teams`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
                body: JSON.stringify(postBody)
			})
			.then(
                (successRes) => {
					return successRes
				},
                (failureRes) => {
					setReceivedScores({}); 
					return failureRes},
            )
            .then(
                (resolvedRes) => {
					return resolvedRes.json()},
            )
            .catch((error) => {
				// console.log(error);
				setReceivedScores({});
				setMessage("Can not fetch results. Some error occurred")
				setErrorMessageModalOpen(true);
			});
			if (fetchedScores.status == "ok"){
				// console.log(Object.values(fetchedScores.result.studentsScheduleMatrixScoresNormalised));
				let scores = Object.values(fetchedScores.result.studentsScheduleMatrixScoresNormalised).map((objects)=> Object.values(objects))
				setReceivedScores(scores);
				let perQuestionScores = Object.values(fetchedScores.result.allStudentsOtherStudentsStats).map((objects)=> Object.values(objects))
				console.log(perQuestionScores[0]);
				setPerQuestionStats(perQuestionScores);
			}else if(fetchedScores.status == "error"){
				if (retryId <= maxRetries ) setRetryId(retryId + 1);
				setReceivedScores({});
				setMessage(fetchedScores.error || fetchedScores.errorFull);
				setErrorMessageModalOpen(true);
			}
		}
		fetchScores();
	},[fetchScoresId]);

	// return <div>OK</div>

	// if (false)

	return (
		<Grid columns={16}>
			<GridRow columns={16}>
				<GridColumn width={2} />
				<GridColumn width={12}>
					{
						receivedScores && receivedScores.length>0 && receivedScores.map((perStudentScores, index) => 
							<Grid className={`overall stats student${index} `} columns={12} key={`overall stats student${index} `}>
								<GridRow columns={8} >
									<GridColumn width={4} >
												{
													perStudentScores.map((scoreVal, relativeToStudentIndex) => 

													<Message size="small">
														{`Student ${index+1}'s Compatibility - Student ${relativeToStudentIndex+1}:`}
														<Label style={{width:"100%"}}>
															{`${scoreVal}`}
														</Label>
														{perQuestionStats[index] && [0,1,2,3,4,5].map((idx) => {
															<Label style={{width:"100%"}}>
																{perQuestionStats[index][idx][relativeToStudentIndex]}
															</Label>
														}) || <Label>NO PER Q STATS</Label>}
													</Message>	
													)
												}
									</GridColumn>
								</GridRow>
							</Grid>
						)
					}
				</GridColumn>
				<GridColumn width={2} />
			</GridRow>
		</Grid>
	);

}



export default ShowStudentCompatibilityScoresComponent;