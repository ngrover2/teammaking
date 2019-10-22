import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

const ErrorMessageModal = React.forwardRef((props, ref) => {
    var open = props.open;

    return (
        <Modal 
            trigger={
                <Button style={{visibility:"hidden"}} ref={ref}/>
            }
            open={open}
        >
            <Modal.Content>
                {props.errorMessage}
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => {props.closeModal()}}>
                    Ok
                </Button>
            </Modal.Actions>

        </Modal>
    );
});

export default ErrorMessageModal;