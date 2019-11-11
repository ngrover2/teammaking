// Component to display a particular roster.
import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import { useState, useEffect } from 'react';


const PickRosterFileComponent = (props) =>  {
    const [file, setFile] = useState(null);
    const [ courseId, setCourseId ] = useState(props.course_id);

    useEffect(() => {
        setCourseId(props.course_id);
    },[props]);

    useEffect(() => {
        // console.log(`will pass file for course_id:${courseId} `)
        if (file) props.passSelectedFile(file, courseId);
    },[file]);

    
    function setFileName(e,d){
        if (e.target.files.length > 0){
            setFile(e.target.files[0]);
            // setCurrentSelection(`You selected: ${e.target.files[0].name}`);
        }else{
            console.log("No files selected.")
            setFile({name:""})
            // setCurrentSelection("Selected file name will appear here.")
        }
    }

    return (
        <Input 
            key={`file-picker-course-${courseId}`}
            className={`file-picker-course-${courseId}`}
            type='file' 
            id={`hiddenFilePickerButtonId-course${courseId}`}
            onChange={(event, data) => setFileName(event, data)} 
            style={{visibility:"hidden"}}
        />
    );
}

export default PickRosterFileComponent;

    

    