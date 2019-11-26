{/**/}
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import StudentResponseComponent from '../../API/saveStudentResponseController';

var StudentResponseSurveyComponentDetails = {
    "survey_answers":{
        "studentID":"1",
        "surveyID": "2"
    },
    "answer_object":
    {
        "1":
            {
                "type":"freeform",
                "answer":"1.yes"
            },
        "2":{    
                "type":"freeform",
                "answer":"1.python"
            },
    }
}; 


function IsJsonString(str) {
    try {
        var sanitized = '[' + data.replace(/}{/g, '},{') + ']';
        var res = JSON.parse(sanitized);

        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

it('renders correctly', () => {
    if  (IsJsonString(StudentResponseSurveyComponentDetails) == true) {
    
        const tree = renderer.create(
            <StudentResponseComponent {...StudentResponseSurveyComponentDetails}/>
          ).toJSON();
          expect(tree).toMatchSnapshot();
    
    }

});
