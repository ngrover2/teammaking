// Component to display rosters to pick from.
import { useState, useEffect } from 'react';
import React from 'react';
import { Table, Header, HeaderCell, Row, Grid, Button, Input, Label, Tab, Checkbox } from 'semantic-ui-react';
import { Redirect , useLocation, useParams, useHistory } from 'react-router-dom';
import { default as MessageComponent } from '../Utils/ErrorMessageComponent';

const getEmptyStudentRow = () => (<Table.Row><Table.Cell>No Students in the roster</Table.Cell></Table.Row>)
const getEmptyHeaderRow = () => (<Table.Cell>No Header present in roster file</Table.Cell>)

const DisplayPickedFile = (props) => {
    var { state } = useLocation();
    console.log(state);
    const [ receivedHeader, setReceivedHeader ] = useState(state.header || []);
    const [ receivedStudents, setReceivedStudents ] = useState(state.data || []);
    var history = useHistory();

    const { cid, pid } = useParams();
    
    // const [ headerEditable, setHeaderEditable ] = useState(false);
    const [ header, setHeader ] = useState([]);

    let mapping = Object.assign({});
        receivedHeader.forEach((val)=>{
                mapping[val]=val
        });
    const [ headerColumnsOldToNewNamesMapping, setHeaderColumnsOldToNewNamesMapping  ] = useState(mapping);
    
    const [ students, setStudents ] = useState([]);
    const [ doUpload, setDoUpload ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ messageModalOpen, setMessageModalOpen ] = useState(false);
    const [ uploadAttemptId, setUploadAttemptId ] = useState(0);
    const [ uploadFailedId, setUploadFailedId ] = useState(0);
    const [ uploadSucceededId, setUploadSucceededId ] = useState(0);
    const [ responseCode, setResponseCode ] = useState(0); // 1 for success, 0 for failure

    const [ headerLength, setHeaderLength ] = useState(0);
    
    const [ updatedId, setUpdatedId ] = useState(0);
    const [ headerUpdatedId, setHeaderUpdatedId ] = useState(0);

    const [ lockHeader, setLockHeader ] = useState(React.createRef());

    const messageButtonRef = React.createRef();

    useEffect(()=> {
        // console.log("useEffect setHeader called") //DEBUG
        let formattedHeader = true;
        if (formattedHeader){
            setHeader(<HeaderRowComponent id="headerRow" ref={lockHeader}/>);
        }
    },[headerUpdatedId])

    useEffect(()=> {
        let formattedStudents = getRows();
        if (formattedStudents && formattedStudents.length > 0){
            setStudents(formattedStudents);
        }else{
            setStudents(getEmptyStudentRow())
        }
    },[updatedId])

    useEffect(()=>{
        if (uploadAttemptId !== 0) uploadRoster();
    },[uploadAttemptId])

    useEffect(()=> {
        if (uploadFailedId !== 0){
            // Nothing for now
        }
    },[uploadFailedId])

    useEffect(()=> {
        if (uploadSucceededId !== 0){
            history.goBack()
        }
    },[uploadSucceededId])


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
            // headerArray[hidx].name = headerColumnsOldToNewNamesMapping[headerColName]
            // headerArray[hidx].multi = true
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
    
            let responseJson = await response.json()
            if (responseJson){
                if (responseJson.status == "ok"){
                    console.log(responseJson)
                    setResponseCode(1);                    
                    setMessage("Roster uploaded successfully");
                    setMessageModalOpen(true);
                }else{
                    setResponseCode(0);                    
                    setMessage(`${responseJson.error || "Problem uploading roster"}`);
                    setMessageModalOpen(true);
                }
            }else{
                setResponseCode(0);                    
                setMessage("Problem uploading roster");
                setMessageModalOpen(true);
            }
        }catch(error){
            setResponseCode(0);                    
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
        let mapping = Object.assign({});
        receivedHeader.forEach((val)=>{
                mapping[val]=val
        });
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
                (
                    <Table.Row>
                        {getEmptyHeaderRow()}
                    </Table.Row>
                )
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
                if(colName) return state.header[state.header.indexOf(colName)]
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
                            // <HeaderRowComponent ref={lockHeader} />
                        }
                        
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
                        <Button positive onClick={()=> history.goBack()}>Go Back</Button>
                </Grid.Column>
                <Grid.Column width={3}>
                        <Button positive onClick={()=> setUploadAttemptId(uploadAttemptId+1)}>Upload</Button>
                </Grid.Column>
                <MessageComponent 
                    ref={messageButtonRef} 
                    errorMessage={message} 
                    open={messageModalOpen} 
                    closeModal={
                        () => {
                            setMessageModalOpen(false);
                            if (responseCode){
                                if (responseCode == 0 ){
                                    setUploadFailedId(uploadFailedId + 1 );
                                }else{
                                    setUploadSucceededId(uploadSucceededId + 1 );
                                }
                            }
                        }
                    }/>
            </Grid.Row>
        </Grid>
    );
}

export default DisplayPickedFile


// Code to add Checkboxes to the header to indicate multi-values
/*
<Checkbox 
    id={idx} 
    // checked={headerCheckboxes[idx]}
    onChange={
        (e) => {
            console.log("received", headerCheckboxes);
            let updated = headerCheckboxes.slice(0,headerCheckboxes.length).map(
                (v,i) => { 
                    if(i == idx){
                        return e.target.checked
                    }else{
                        return v
                    }
                });
            console.log("updated", updated)
            setHeaderCheckboxes(updated);
            setHeaderCheckboxesChangedId(headerCheckboxesChangedId+1);
        }
    } 
></Checkbox>

// useEffect(() => {
        //     console.log("useEffect to change checkboxes state of headerRowComponent called")
        //     console.log("headerCheckboxes", headerCheckboxes);
        //     console.log("localHeaderCheckboxes", localHeaderCheckboxes);
        //     // console.log(headerCheckboxes);
        //     setLocalHeaderCheckboxes(headerCheckboxes);
        // },[headerCheckboxesChangedId])

// const [ localHeaderCheckboxes, setLocalHeaderCheckboxes ] = useState([false, false, false, false, false ]);
// const [ headerCheckboxes, setHeaderCheckboxes ] = useState([...localHeaderCheckboxes]);
// const [ headerCheckboxesChangedId, setHeaderCheckboxesChangedId ] = useState(0);
*/