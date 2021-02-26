import React, { Component } from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader, Button, Input, Label} from 'reactstrap';

class PasswordModal extends Component {
    constructor(props) {
        super(props);
        this.state = {password: this.props.password, open: this.props.open}
    }

    toggle = () => {
        const open = this.props.open;
        this.props.open = !open;
    }

    render() {
      const password = this.props.password;
      const open = this.props.open;
      return(
        <Modal isOpen={open} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}>{password.site}</ModalHeader>
            <ModalBody>
            <Label>Username:</Label>
            <Input readOnly="true" value={password.username}/>
            <Label>Password:</Label>
            <Input readOnly="true" value={password.password}/>
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={this.props.toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
      )  
    }
}
export default PasswordModal;