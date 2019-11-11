// File that returns a component for a freeform question
import React from 'react';
import { Form } from 'semantic-ui-react';
export default function FreeformComponent(props) {
    return <Form.TextArea label={props.question} />

}