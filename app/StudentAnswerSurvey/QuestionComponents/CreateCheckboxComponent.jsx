// File that returns a component for a checkbox question
import { Form } from 'semantic-ui-react';
import React from 'react';

export default function CheckboxComponent(props) {
    const getfields = () => {
        console.log(props.options);
        return props.options.map((v,i) => 
                <Form.Field
                    key={i}
                    label= { v }
                    control='input'
                    type='checkbox'
                    name='htmlRadios'
              />
        );
        
    };

    return(
        <div>
            <Form.Group grouped>
                <label>{ props.question }</label>
                {getfields()}
            </Form.Group>
        </div>
    );

}
