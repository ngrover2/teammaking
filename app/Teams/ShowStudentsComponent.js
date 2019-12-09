import React from "react"
import { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { Table, Grid, Message, Segment, Label, Button, GridRow, GridColumn } from 'semantic-ui-react'
import { default as ErrorMessageComponent } from '../../app/Utils/ErrorMessageComponent';


const ShowStudentCompatibilityScoresComponent = (props) => {
	const [ fetchScoresId ] = useState(0);
	const [ receivedScores, setReceivedScores ] = useState({}); 
	const [ scoresTableHeaderData, setScoresTableHeaderData ] = useState([]); 
	const [ errorMessageModalOpen, setErrorMessageModalOpen ] = useState(false);
	const [ message, setMessage ] = useState("");
	const [ retryId, setRetryId ] = useState(0);
	const maxRetries = 1;
	const studentIndexToNameMapping = {
		0: "Cameron",
		1: "Chase",
		2: "Foreman",
		3: "Taub",
		4: "Thirteen",
		5: "Kutner",
		6: "Masters",
		7: "Adams",
		8: "Park",
		9: "Vogler",
		10: "Cuddy",
		11: "Wilson",
		12: "Tritter",
		13: "Stacy",
		14: "Diana",
		15: "Lucas",
		16: "Chris",
		17: "Benjamin",
		18: "Amber",
		19: "Bruce",
		20: "Clark",
		21: "Selena",
		22: "Robert",
		23: "Peter"
	}

	const [ perQuestionStats, setPerQuestionStats ] = useState({});
	const [ studentsOriginalAnswers, setStudentsOriginalAnswers ] = useState({});

	useEffect(() => {
		async function fetchScores(){
			let postBody = {
				// nothing to send for now
			}

			let fetchedScores = await fetch(`http://localhost:3000/professor/1/course/1/survey/1/scores`,{
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
			if (fetchedScores){
				if (fetchedScores.status == "ok"){
					// console.log(Object.values(fetchedScores.result.studentsScheduleMatrixScoresNormalised));
					let scoresMatrix = fetchedScores.result.studentsScoresMatrixNormalised
					let scores = Object.values(scoresMatrix).map((objects) => Object.values(objects))
					setScoresTableHeaderData(Object.keys(scoresMatrix))
					setReceivedScores(transformScoresToRange(scores, 0, 100));
					let perQuestionScores = Object.values(fetchedScores.result.studentsPerQuestionScores).map((objects)=> Object.values(objects))
					// console.log("setReceivedScores");
					// console.log(scores);
					setPerQuestionStats(perQuestionScores);
				}else if(fetchedScores.status == "error"){
					if (retryId <= maxRetries ) setRetryId(retryId + 1);
					setReceivedScores({});
					setMessage(fetchedScores.error || fetchedScores.errorFull);
					setErrorMessageModalOpen(true);
				}
			}
		}
		fetchScores();
	},[fetchScoresId]);

	const renderHeaderRow = (studentIndices) => {
		return ["Compared to Student -> ",...studentIndices.map((sidx) => `${studentIndexToNameMapping[sidx]}`)]
	}

	const renderBodyRow = ({studIdx, scoresRow}, i) => {
		return (
			<Table.Row
				key = {`student-${studIdx}-scores`}
			>
				{[<Table.Cell key={`cell-label-student-${studIdx}-scores`}><b>{`${studentIndexToNameMapping[studIdx]}`}</b></Table.Cell>, ...scoresRow.map((scoreVal, relativeToStudentIndex) => <Table.Cell key = {`cell-${i}-${relativeToStudentIndex}-score`} style={cellValueToStyle(scoreVal[0])}>{`${scoreVal[0]}`}</Table.Cell>)]}
			</Table.Row>
		)
	}

	const cellValueToStyle = (val) => {
		val = parseInt(val)
		switch(true){
			case (val > 0 && val <= 40) : return {color:"wheat", backgroundColor: "red", fontWeight:"bold"}
			case (val > 40 && val <= 60) : return {color:"white", backgroundColor: "#d9d15d", fontWeight:"bold"}
			case (val > 60 && val <= 80) : return {color:"white", backgroundColor: "rgb(156, 191, 92)", fontWeight:"bold"}
			case (val > 80 && val <= 100) : return {color:"white", backgroundColor: "green", fontWeight:"bold"}
			default : return {color:"white", backgroundColor: "grey"}
		}
	}

	const transformScoresToRange = (scores, minRange, maxRange) => {
		let minScore = +10000000
		let maxScore = -10000000
		scores.forEach((row, ss_idx) => {
			row.forEach((score, s_idx) => {
				minScore = score[0] < minScore ? score[0] : minScore
				maxScore = score[0] > maxScore ? score[0] : maxScore
			})
		})
		scores = scores.map((scores, ss_idx) => {
				return scores.map((score, s_idx) => {
					let scaledScore = Math.round(((score[0] - minScore) / (maxScore - minScore)) * (maxRange - minRange) + (minRange))
					return [scaledScore, score[1]]
				})
			})
		return scores
	}
	
	if (receivedScores.length > 0){
		
		return [
			<Grid columns={16} key={`grid-scores`}>
			{
				receivedScores.map((perStudentScores, studIdx) => {
					return <GridRow columns={16} style={{overflowX: "scroll"}} key={`grid-scores-row-student-${studIdx}`}>
						<Table
							key = {`scores-table-student-${studIdx}`}
							celled
							headerRow = {renderHeaderRow(perStudentScores.map((v) => v[1]))}
							renderBodyRow = {renderBodyRow}
							tableData= {[{studIdx:studIdx, scoresRow: perStudentScores}]}
						>
						</Table>
					</GridRow>
				})
			}
			</Grid>
		];
	}
	
	else return <Message>No Scores found</Message>
}



export default ShowStudentCompatibilityScoresComponent;


// <Grid columns={16} key = {`scores-grid`}>
// 			<GridRow columns={16}>
// 				<GridColumn width={2} />
// 				<GridColumn width={12}>
// 					{
// 						receivedScores && receivedScores.length > 0 && receivedScores.map((perStudentScores, index) => 
// 							<Grid className={`overall stats student${index} `} columns={12} key={`overall stats student${index} `}>
// 								<GridRow columns={8} >
// 									<GridColumn width={4} >
// 												{
// 													perStudentScores.map((scoreVal, relativeToStudentIndex) => 

// 													<Message size="small">
// 														{`Student ${index+1}'s Compatibility - Student ${relativeToStudentIndex+1}:`}
// 														<Label style={{width:"100%"}}>
// 															{`${scoreVal}`}
// 														</Label>
// 														{perQuestionStats[index] && [0,1,2,3,4,5].map((idx) => {
// 															<Label style={{width:"100%"}}>
// 																{perQuestionStats[index][idx][relativeToStudentIndex]}
// 															</Label>
// 														}) || <Label>NO PER Q STATS</Label>}
// 													</Message>	
// 													)
// 												}
// 									</GridColumn>
// 								</GridRow>
// 							</Grid>
// 						)
// 					}
// 				</GridColumn>
// 				<GridColumn width={2} />
// 			</GridRow>
// 		</Grid>