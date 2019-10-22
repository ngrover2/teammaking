import { useState, useEffect } from 'react';
import React from 'react';
import { Table, Header, HeaderCell, Row } from 'semantic-ui-react';

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

const DisplayRosterDetailsComponent = (props) => {

    const [ header, setHeader ] = useState(["name", "email", "skill", "age"]);
    const [ students, setStudents ] = useState([]);
    const [ studentsUpdatedId, setStudentsUpdatedId ] = useState(0);

    const getHeaders = () => {
        var ret = []
        if (header){
            header.forEach((v,i) => {
                console.log(v)
                ret.push(<HeaderCellComponent key={v} headerName={v}/>);
            });
        }
        return ret;
    }

    const getRows = () => {
        var retRows = []
        if (students){
            students.forEach((v,i) => {
                console.log(v)
                retRows.push(<StudentRowComponent key={i} {...v}/>);
            });
        }
        return retRows;
    }

    useEffect( () => {
        console.log("useEffect called for fetchRoster");
        async function fetchRoster(){
            var fetchStudents = await fetch("http://localhost:3000/course/roster/9")
            .then(
                (successRes) => successRes,
                (failureRes) => []
            )
            .then(
                (resolvedRes) => {console.log("resolvedRes",resolvedRes);return resolvedRes.json()},
            )
            .then(
                (json) => {console.log("json",json);return json.result},
            )
            .catch((error) => {
                console.log(error);
                return [];
            })
            if (fetchStudents) setStudents(fetchStudents)
        }
        fetchRoster();
    },[studentsUpdatedId]);
    
    return (
        <Table celled padded>
            <Table.Header>
            <Table.Row>
                {
                    getHeaders()
                }
            </Table.Row>
            </Table.Header>

            <Table.Body>
                {getRows()}
            </Table.Body>
        </Table>
    );
}

export default DisplayRosterDetailsComponent;