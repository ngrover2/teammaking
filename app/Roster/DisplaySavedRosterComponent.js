// Component to display the roster from the database.
import { useState, useEffect } from 'react';
import React from 'react';
import { Table, Header, HeaderCell, Row, Grid, Button, Input, Label, Tab, Checkbox } from 'semantic-ui-react';
import { default as MessageComponent } from '../Utils/ErrorMessageComponent';
import { Redirect, useParams, useHistory } from 'react-router-dom';

const getEmptyStudentRow = () => (<Table.Row><Table.Cell>No Students in the roster</Table.Cell></Table.Row>)
const getEmptyHeaderRow = () => (<Table.Row><Table.HeaderCell>No Header present in roster file</Table.HeaderCell></Table.Row>)

const DisplaySavedRosterComponent = (props) => {
    const [ receivedHeader, setReceivedHeader ] = useState(null);
    const [ receivedHeaderObj, setReceivedHeaderObj ] = useState(null);
    const [ receivedStudents, setReceivedStudents ] = useState([]);
    const  history = useHistory();
    
    const [ header, setHeader ] = useState([]);
    const [ headerColumnsOldToNewNamesMapping, setHeaderColumnsOldToNewNamesMapping  ] = useState({});

    const { rid, cid, pid } = useParams();
    
    const [ students, setStudents ] = useState([]);
    const [ initialFetchId ] = useState(0);
    const [ message, setMessage ] = useState("");
    const [ messageModalOpen, setMessageModalOpen ] = useState(false);
    const [ uploadAttemptId, setUploadAttemptId ] = useState(0);
    
    const [ updatedId, setUpdatedId ] = useState(0);
    const [ headerUpdatedId, setHeaderUpdatedId ] = useState(0);

    const [ lockHeader ] = useState(React.createRef());

    const messageButtonRef = React.createRef();
    
    useEffect(() => {
        console.log("useEffect called for fetchRoster called");
        async function fetchRoster(){
            let postBody = {
                roster_id: rid,
            }
            var fetchStudents = await fetch(`http://localhost:3000/professor/${pid}/course/${cid}/roster/${rid}`,{
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
            if (fetchStudents){
                console.log(`Data Fetched, setting headerUpdateId from ${headerUpdatedId} to ${headerUpdatedId+1}`)
                // console.log(fetchStudents.header);
                // console.log(fetchStudents.data);
                setReceivedHeader(fetchStudents.header);
                setReceivedStudents(fetchStudents.data);
                setHeaderUpdatedId(headerUpdatedId+1);
            }
        }
        fetchRoster();
    }, [initialFetchId])

    useEffect(()=> {
        console.log("useEffect for headerUpdatedId called") //DEBUG        
        // let formattedHeader = true;
        if (receivedHeader){
            // let hdr = [];
            console.log(receivedHeader);
            // for (var property in receivedHeader){
            //     console.log(property);
            //     console.log(receivedHeader[property]);
            //     hdr.push(receivedHeaderObj[property]);  
            // }
            // console.log(hdr);
            // setReceivedHeader(hdr);
            console.log("receivedHeader, creating HeaderRow") //DEBUG        
            // console.log(receivedHeaderObj);
            setHeader(<HeaderRowComponent id="headerRow" ref={lockHeader}/>);
            setUpdatedId(updatedId+1);
            constructMapping();
        }else{
            console.log("No receivedHeader, cannot create HeaderRow") //DEBUG        
            setHeader(getEmptyHeaderRow());
            setStudents(getEmptyStudentRow());
        }
    },[headerUpdatedId])

    useEffect(() => {
        console.log("useEffect for updatedId called") //DEBUG        
        if (receivedHeader){
            console.log("receivedHeader, creating StudentObjects") //DEBUG        
            let formattedStudents = getRows();
            if (formattedStudents && formattedStudents.length > 0){
                console.log("Got Student Rows, creating StudentRows") //DEBUG        
                setStudents(formattedStudents);
            }else{
                console.log("No StudentObjects, cannot create StudentRows") //DEBUG        
                setStudents(getEmptyStudentRow());
            }
        }else{
            console.log("No receivedHeader, cannot create StudentObjects") //DEBUG        
            setStudents(getEmptyStudentRow());
        }
    },[updatedId])

    useEffect(()=>{
        if (uploadAttemptId !== 0) uploadRoster();
    },[uploadAttemptId])
    
    function constructMapping(){
        let mapping = Object.assign({});
        if (receivedHeader){
            receivedHeader.forEach((val)=>{
                mapping[val]=val
            });
            setHeaderColumnsOldToNewNamesMapping(mapping)
        }
    }

    async function uploadRoster(){
        // console.log(receivedStudents); // DEBUG
        // console.log(headerColumnsOldToNewNamesMapping); // DEBUG
        // console.log(receivedHeader); // DEBUG
        
        // Header and Rows columns need to be in the same order
        let studentArray = []
        let headerArray = []
        
        // Transform the student objects' data into arrays and make sure they are ordered as per the header name order
        receivedStudents.forEach((student, idx)=>{
            studentArray[idx] = [];
            receivedHeader.forEach((headerColName,hidx)=>{
                studentArray[idx][hidx] = student[headerColName]
            })
        })
        console.log(studentArray) //DEBUG

        // Map the header column name to the changes made by the user
        
        receivedHeader.forEach((headerColName,hidx)=>{
            let tmp = {}
            tmp.name = headerColumnsOldToNewNamesMapping[headerColName]
            tmp.multi = true
            headerArray.push(tmp)
        })
        console.log(headerArray) //DEBUG
        let postBody = {
            header_row: headerArray,
            data_rows: studentArray,
            course_code:'CC1234', // Hardcoded now, will change later when it is received dynamically
            professor_name:'Harini Ramaprasad', // Hardcoded now, will change later when it is received dynamically
            course_id:cid
        }
        console.log(postBody);

        try{
            let response = await fetch(`http://localhost:3000/professor/${pid}/course/${cid}/roster/save`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
                body: JSON.stringify(postBody)
            })
            let responseJson = null;
            if (!response){
                throw new Error("Network error prevented the request from succeeding.")
            }
            try{
                responseJson = await response.json()
            }catch{
                throw new Error("Invalid response received from the server")
            }
            if (responseJson){
                if (responseJson.status == "ok"){
                    console.log(responseJson)
                    setMessage("Roster uploaded successfully");
                    setMessageModalOpen(true);
                }else{
                    setMessage(`${responseJson.error || "An error occurred trying to update the roster"}`);
                    setMessageModalOpen(true);
                }
            }else{
                throw new Error("Invalid response received from the server")
            }
        }catch(error){
            setMessage(error.message);
            setMessageModalOpen(true);
        }
        
        if (lockHeader && lockHeader.current && lockHeader.current.ref && lockHeader.current.ref.current) lockHeader.current.ref.current.click()
    }

    function getHeaders(){
        if (receivedHeader){
            return <HeaderRowComponent id={"headerRow"} />
        }else{
            return getEmptyHeaderRow();
        }
    }

    function getRows() {
        var retRows = []
        if (receivedStudents){
            receivedStudents.forEach((v,i) => {
                // console.log("student instance", v)
                retRows.push(<StudentRowComponent key={i} index={i} studentObj={v} id={i}/>);
            });
        }
        return retRows;
    }

    const HeaderRowComponent = React.forwardRef((props,ref) => {
        console.log("HeaderRowComponent Created")
        let editHeaderCellStyle = {
            backgroundColor:"black",
            color:"white"
        }

        // localHeader is local to the HeaderRowComponent component and any changes to it would call render only the HeaderRowComponent
        // and not the whole DisplayPickedFile component, which is what we want
        const [ localHeader, setLocalHeader ] = useState([...receivedHeader]);
        // const [ localHeaderCheckboxes, setLocalHeaderCheckboxes ] = useState([...receivedHeader].map((v)=> false));
        
        const [ renderedHeader, setRenderedHeader ] = useState([...receivedHeader]);
        const [ localHeaderUpdatedId, setLocalHeaderUpdatedId ] = useState(0);
        
        // headerValues keeps track of state changes to the input tags (modifiable header column names) in the localHeader
        // headerValues is initialised with a copy of receivedHeader. 
        // We keep duplicate local state in headerValues, because if we change localHeader directly,
        // the input tags' values will be matched with localHeader values but they have not been updated yet because updating them requires a re-render of HeaderRowComponent
        // We propagate local changes to the localHeader on Lock Header button click
        const [ headerValues, setHeaderValues ] = useState([...receivedHeader]);
        
        
        const [ headerEditable, setHeaderEditable ] = useState(false);
        // let mapping = Object.assign({});
        // receivedHeader.forEach((val)=>{
        //         mapping[val]=val
        // });
        const [ headerNameChangeMapping, setHeaderNameChangeMapping ] = useState(headerColumnsOldToNewNamesMapping)

        useEffect(() => {
            // console.log("useEffect of headerRowComponent called") //DEBUG
            let newHeader = constructHeader();
            newHeader ? setRenderedHeader(newHeader) : setRenderedHeader(getEmptyHeaderRow());
        },[localHeaderUpdatedId])

        function constructHeader(){
            try{
                console.log(`${""}`);
                console.log(`${"constructHeader called"}`);
                // console.log("localHeader",localHeader);
                // console.log("header", header);
                console.log("headerEditable",`${headerEditable}`);
                let headerRowCells = []
                if (localHeader.length < 1) {console.log(`${"constructHeader returning NULL"}`);return null};
                localHeader.forEach((col,idx) => {
                    headerRowCells.push(
                        <Table.HeaderCell key={`$header-${idx}-col-${col}`}>
                            {
                                        headerEditable &&
                                        (<Input 
                                            style={editHeaderCellStyle}
                                            value={headerValues[idx]}
                                            // value={localHeader[idx]}
                                            onChange={(e)=> {
                                                    let changedVal = e.target.value
                                                    // create new header array with changed colName from input
                                                    let updatedHeader = [...localHeader.slice(0,idx), changedVal ,...localHeader.slice(idx+1)];
                                                    console.log("updatedHeader", updatedHeader);
                                                    
                                                    // set the new headerValues
                                                    setHeaderValues(updatedHeader);
                                                    // setLocalHeader(updatedHeader);

                                                    // update the UI that reflects the change in (uncomitted) headerValues. 
                                                    // Uncommitted because headerValues has not been copied over to localHeader. 
                                                    // That will happen only when Lock Header is clicked.
                                                    console.log(headerNameChangeMapping)
                                                    setHeaderNameChangeMapping(Object.assign({}, headerNameChangeMapping,{[col]: changedVal}));
                                                    setLocalHeaderUpdatedId(localHeaderUpdatedId+1);
                                                }
                                            }
                                        />)
                                    ||
                                        <Label>{col}</Label>
                            }
                        </Table.HeaderCell>
                    );
                })
                // console.log("headerRowCells",headerRowCells);
                return headerRowCells;
            }catch(err){
                console.log(err);
                return null;
            }
        }

        try{
            if (receivedHeader && receivedHeader.length < 1){
                return (
                    <Table.Row>
                        {renderedHeader}
                    </Table.Row>
                );
            }
            return (
                <Table.Row>
                    {renderedHeader}
                    <Table.HeaderCell key="editRow">
                        <Button type="submit" active={headerEditable} onClick={()=> {
                                                    console.log("EDIT HEADER callled")
                                                    if (headerEditable) return
                                                    setHeaderEditable(true);
                                                    setLocalHeader(localHeader);
                                                    // change headerUpdatedId so that new ( updated ) header is rendered, i.e. one which is editable in this case
                                                    // setHeaderUpdatedId(headerUpdatedId+1)

                                                    // setLocalHeaderUpdatedId(localHeaderUpdatedId+1);
                                                    
                                                    setLocalHeaderUpdatedId(localHeaderUpdatedId + 1)
                                            }
                                        }
                                onSubmit={()=>console.log("enter clicked")}
                        >
                            Edit Header
                        </Button>
                    </Table.HeaderCell>
                    <Table.HeaderCell key="lockHeader">
                            <Button ref={ref} onClick={()=> {
                                                        console.log("LOCK HEADER callled")
                                                        setHeaderEditable(false);
                                                        setLocalHeader(headerValues);
                                                        setLocalHeaderUpdatedId(localHeaderUpdatedId + 1)
                                                        console.log("headerNameChangeMapping",{...headerNameChangeMapping});
                                                        setHeaderColumnsOldToNewNamesMapping(headerNameChangeMapping);
                                                }}>Lock Header</Button>
                        </Table.HeaderCell>
                </Table.Row>
            );
        }catch{
            return (
                getEmptyHeaderRow()
            );
        }
    })

    const StudentRowComponent = (props) => {
        let editRowCellStyle = {
            backgroundColor:"black",
            color:"white"
        }
        
        let localStateStudent = receivedStudents.slice(props.id,props.id+1)[0];
        const [ receivedValues, setReceivedValues ] = useState(props.studentObj);
        
        function constructRow(){
            console.log("constructRow called")
  
            function getMatchingHeaderName(colName){
                if(colName) return receivedHeader[receivedHeader.indexOf(colName)]
                return null;
            }
            let rowCells = []
            for (var prop in receivedValues) {
                if (["editable"].indexOf(prop) > -1) continue
                if (Object.prototype.hasOwnProperty.call(receivedValues, prop)) {
                    let receivedValue = receivedValues[prop]
                    // console.log("receivedValue",receivedValue)
                    let headerCol = getMatchingHeaderName(prop);
                    if (headerCol){
                        // console.log("headerCol",headerCol)
                        rowCells.push(
                            <Table.Cell key={`prop-${prop}`}>
                                {
                                    props.studentObj.editable &&
                                        <Input 
                                            style={editRowCellStyle} 
                                            value={receivedValue} 
                                            onChange={(e)=> {
                                                    localStateStudent[headerCol] = e.target.value;
                                                    setReceivedValues(Object.assign({},receivedValues,{[headerCol]:e.target.value}));
                                                    console.log("localStateStudent",localStateStudent)
                                                }
                                            }
                                        />
                                    ||
                                        (<Label>{receivedValue}</Label>)
                                }
                            </Table.Cell>    
                        );
                    }else{
                        console.log("receivedValue",receivedValue)
                        console.log("here")
                    }
                        
                }
            }
            return rowCells;
        }
        
        try{
            return (<Table.Row>
                {constructRow()}
                <Table.Cell key="editRow">
                    <Button onClick={()=> {setReceivedStudents(receivedStudents.map((v,i)=> {if (i == props.id) {v.editable = true} return v}));setUpdatedId(updatedId+1) }}>Edit</Button>
                </Table.Cell>
                <Table.Cell key="lockRow">
                    <Button onClick={()=> {setReceivedStudents(receivedStudents.map((v,i)=> {if (i == props.id) {localStateStudent.editable = false; return localStateStudent} else {return v}}));setUpdatedId(updatedId+1) }}>Lock</Button>
                </Table.Cell>
                <Table.Cell key="removeRow">
                    <Button onClick={()=> {setReceivedStudents(receivedStudents.filter((v,i)=> i != props.id));setUpdatedId(updatedId+1) }}>Delete</Button>
                </Table.Cell>
            </Table.Row>)
        }catch(err){
            console.log(err);
            return getEmptyStudentRow();
        }
    };
    
    return (
        <Grid>
            <Grid.Row width={12}>
                <Table celled padded>
                    <Table.Header>
                        {
                            header
                        }
                        
                    </Table.Header>

                    <Table.Body>
                        {
                            students
                        }
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={3}>
                        <Button positive onClick={()=> history.goBack()}>Go Back</Button>
                </Grid.Column>
                <Grid.Column width={3}>
                        <Button positive onClick={()=> {(receivedHeader && receivedHeader.length>0) ? setUploadAttemptId(uploadAttemptId+1) : 0}} disabled={(receivedHeader && receivedHeader.length>0) ? false : true}>Update</Button>
                </Grid.Column>
                <MessageComponent ref={messageButtonRef} errorMessage={message} open={messageModalOpen} closeModal={() => setMessageModalOpen(false)}/>
            </Grid.Row>
        </Grid>
    );
}

export default DisplaySavedRosterComponent;