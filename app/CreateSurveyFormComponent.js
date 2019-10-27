import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Dropdown, Radio, FormButton, TextArea, FormCheckbox, Checkbox } from 'semantic-ui-react';



export default CreateSurveyComponent = (props) => {

    const [ surveyQuestions, setSurveyQuestions ] = useState([]);
    new Enumerator(["DROPDOWN", "RADIO", "TEXTAREA", "CHECKBOX"]);

    

}
