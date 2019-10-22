import { useState, useEffect } from 'react';
import React from 'react';
import { Table, Header, HeaderCell, Row, Grid, Button } from 'semantic-ui-react';
import { Redirect ,useLocation } from 'react-router-dom';


const HeaderCellComponent = (props) => (<Table.HeaderCell singleLine>{props.headerName}</Table.HeaderCell>);
const StudentRowComponent = (props) => (
    <Table.Row>
        <Table.Cell>
            {props.name}
        </Table.Cell>
        <Table.Cell>
            {props.email}
        </Table.Cell>
        <Table.Cell>
            {props.skill}
        </Table.Cell>
        <Table.Cell>
            {props.age}
        </Table.Cell>
    </Table.Row>
);
const getEmptyStudentRow = () => (<Table.Row><Table.Cell>No Students in the roster</Table.Cell></Table.Row>)
const getEmptyHeaderRow = () => (<Table.Cell>No Header present in roster file</Table.Cell>)

const DisplayPickedFile = (props) => {
    var { state } = useLocation();
    const [ receivedHeader ] = useState(state.header || []);
    const [ receivedStudents ] = useState(state.data || []);
    
    const [ header, setHeader ] = useState([]);
    const [headerFields, setHeaderFields ] = useState([]);
    const [ students, setStudents ] = useState([]);
    const [ goBack, setGoBack ] = useState(false);
    
    const [ updatedId ] = useState(0);

    useEffect((receivedHeader)=>{
        let formattedHeader = getHeaders();
        if (formattedHeader){
            setHeader(formattedHeader);
        }
    },[updatedId])

    useEffect((receivedStudents)=>{
        let formattedStudents = getRows();
        if (formattedStudents){
            setStudents(formattedStudents);
        }
    },[updatedId])

    function getHeaders(){
        var ret = []
        if (receivedHeader){
            receivedHeader.forEach((v,i) => {
                console.log("header instance", v)
                setHeaderFields();
                ret.push(<HeaderCellComponent key={i} headerName={v}/>);
            });
        }

        return ret;
    }

    function getRows(){
        var retRows = []
        if (receivedStudents){
            receivedStudents.forEach((v,i) => {
                console.log("student instance", v)
                retRows.push(<StudentRowComponent key={i} {...v}/>);
            });
        }
        return retRows;
    }
    
    if (goBack) return (<Redirect to="/course"></Redirect>)
    return (
        <Grid>
            <Grid.Row width={12}>
                <Table celled padded>
                    <Table.Header>
                    <Table.Row>
                        {
                            // (headerValid == false && getHeaders()) || getEmptyHeaderRow()
                            // getHeaders()
                            header
                        }
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            // (studentsValid == false && getRows()) || getEmptyStudentRow()
                            // getRows()
                            students
                        }
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={3}>
                        <Button positive onClick={()=> setGoBack(true)}>Go Back</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default DisplayPickedFile