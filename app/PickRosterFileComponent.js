import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import { useState, useEffect } from 'react';


const PickRosterFileComponent = (props) =>  {
    const [file, setFile] = useState(null);
    var [currentSelection, setCurrentSelection] = useState("Selected file name will appear here.");

    useEffect(() => {
        if (file) props.passSelectedFile(file);
    },[file]);

    
    function setFileName(e,d){
        if (e.target.files.length > 0){
            setFile(e.target.files[0]);
            setCurrentSelection(`You selected: ${e.target.files[0].name}`);
        }else{
            console.log("No files selected.")
            setFile({name:""})
            setCurrentSelection("Selected file name will appear here.")
        }
    }

    return (
        <Input 
            type='file' 
            id="hiddenFilePickerButtonId" 
            onChange={(event, data) => setFileName(event, data)} 
            style={{visibility:"hidden"}} 
        />
    );
}

export default PickRosterFileComponent;

    

    