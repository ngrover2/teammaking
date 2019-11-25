// Component to display the teams from the database.
import { useState, useEffect } from 'react';
import React from 'react';
import { Table, Header, HeaderCell, Row, Grid, Button, Input, Label, Tab, Checkbox } from 'semantic-ui-react';
import { default as MessageComponent } from '../Utils/ErrorMessageComponent';
import { Redirect, useParams, useHistory } from 'react-router-dom';

const getEmptyTeamsRow = () => (<Table.Row><Table.Cell>No Teams in the database</Table.Cell></Table.Row>)
const DisplayTeamsComponent = (props) => {
    const [ receivedHeader, setReceivedHeader ] = useState(null);
    const [ receivedHeaderObj, setReceivedHeaderObj ] = useState(null);
    const [ receivedTeams, setRecievedTeams ] = useState([]);
    const  history = useHistory();
    

    const { sid, cid, pid } = useParams();
    
    const [ initialFetchId ] = useState(0);
    
    const [ headerUpdatedId, setHeaderUpdatedId ] = useState(0);


    const messageButtonRef = React.createRef();
    useEffect(() => {
        console.log("useEffect called for fetchTeams called");
        async function fetchTeams(){
            let postBody = {
                survey_id: sid,
            }
            var fetchTeams = await fetch(`http://localhost:3000/professor/${pid}/course/${cid}/survey/${sid}/teams`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
                body: JSON.stringify(postBody)
            })
            .then(
                (successRes) => successRes,
                (failureRes) => []
            )
            .then(
                (resolvedRes) => {console.log("resolvedRes",resolvedRes);return resolvedRes.json()},
            )
            .then(
                (json) => {console.log("json",json);return json.results},
            )
            .catch((error) => {
                console.log(error);
                return [];
            })
            if (fetchTeams){
                console.log(`Data Fetched, setting headerUpdateId from ${headerUpdatedId} to ${headerUpdatedId+1}`)
                // console.log(fetchTeams.header);
                // console.log(fetchTeams.data);
                setReceivedHeader(fetchTeams.header);
                setReceivedStudents(fetchTeams.data);
                setHeaderUpdatedId(headerUpdatedId+1);
            }
        }
        fetchTeams();
    }, [initialFetchId])

    return (
        <Grid>
            <Grid.Row width={12}>
                <Table celled padded>
                    <Table.Header>
                        {
                            'header'
                        }
                        
                    </Table.Header>

                    <Table.Body>
                        {
                            'students'
                        }
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={3}>
                        <Button positive onClick={()=> history.goBack()}>Go Back</Button>
                </Grid.Column>
              </Grid.Row>
        </Grid>
    );
}

export default DisplayTeamsComponent;
