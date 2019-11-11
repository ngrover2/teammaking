// Component to create a free form response question.
import React from 'react';
import { useState, useEffect } from 'react';
import { TextArea, Button, Grid, FormTextArea } from 'semantic-ui-react';


export default function TextAreaQuestionComponent(props){
    const [ value, setValue ] = useState("");
    const [ questionText, setQuestionText ] = useState("");
    const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0);
    const [ displayRendered, setDisplayRendered ] = useState(false);

    useEffect(()=> {
        props.setQuestionText(questionText);
        props.setDisplayRendered(displayRendered);
        props.setNewQuestionAddedId(questionUpdatedId);
    },[questionUpdatedId])

    return  (
        <div>
            <Grid.Column width={12}>
                <FormTextArea value={value} onChange={(e) => {setValue(e.target.value); /*setDisplayRendered(false)*/ ;if (props.onChange) props.onChange()}} style={props.style}/>
            </Grid.Column>
            <Grid.Column width={12}>
                <Button onClick={(e) => { setQuestionText(value); setQuestionUpdatedId(questionUpdatedId > 100 ? 1 : questionUpdatedId + 1); setDisplayRendered(true); if (props.onClick) props.onClick() } } style={{ marginLeft: "2rem" }}>Add Question</Button>
            </Grid.Column>
        </div>
    );
}