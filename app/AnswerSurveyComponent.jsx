// Component to create new Survey.
import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Dropdown, Radio, FormButton, TextArea, FormCheckbox, Checkbox, Button, Grid, FormGroup, FormTextArea, Segment, Message } from 'semantic-ui-react';

export default function AnswerSurveyComponent(props){
    const  survey_id = useParams();
    console.log(survey_id);
    return (<h3>test</h3>);
}