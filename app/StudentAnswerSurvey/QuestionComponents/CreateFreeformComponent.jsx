// File that returns a component for a freeform question
import { Form } from 'semantic-ui-react';
export default function FreeformComponent(props) {
    return(
        <div>
            <Form.TextArea label = {props.question} />
        </div>
    );

}