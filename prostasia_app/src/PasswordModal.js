import { isEmptyObject } from 'jquery';
import React, { Component } from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader, Button, Input, Label, Form, Spinner} from 'reactstrap';

class PasswordModal extends Component {

    emptyPassword = {}

    emptyIdentity = {
        passwords: []
    }

    constructor(props) {
        super(props);
        this.state = {password: this.emptyPassword, identity: this.emptyIdentity, open: this.props.open, readonly: true, buttontext: "Edit", updating: false, newpassword: false}
    }

    componentDidMount = () => {
        let {password, newpassword } = this.state;
        console.log(this.props.password == this.emptyPassword);
        if(this.props.password == this.emptyPassword) {
            this.setState({readonly: false, buttontext: "Submit", newpassword: true});
        } else {
            this.setState({readonly: true, buttontext: "Edit", newpassword: false});
        }
        password['_id'] = !newpassword ? this.props.passwordid : "";
        this.setState({password: password});
        console.log(password);
    }

    toggle = () => {
        const open = this.props.open;
        this.props.open = !open;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {readonly, updating, password, identity} = this.state;
        if(updating) {
            return;
        }
        if(!readonly) {
            if(password == this.emptyPassword) {
                //handle this
                console.log('please do shit mate');
                return;
            }
            identity.passwords.push(password);
            const spinner = <div>Updating... <Spinner size="sm"/></div>;
            this.setState({buttontext: spinner, updating: true})
            fetch('/api/identity/' + this.props.id + '/set', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(identity)
            })
            .then(response => {
                this.setState({buttontext: "Edit", updating: false, identity: this.emptyIdentity, password: this.emptyPassword});
                if(response.ok) {
                    return;
                }
            })
        } else {
            this.setState({buttontext: "Submit"})
        }
        this.setState({readonly: !readonly})
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let password = {...this.state.password};
        password[name] = value;
        this.setState({password});
        console.log(password);
    }

    close = () => {
        this.setState({identity: this.emptyIdentity, password: this.emptyPassword});
    }

    render() {
      const password = this.props.password;
      const open = this.props.open;
      const {readonly, buttontext, newpassword} = this.state;
      console.log(newpassword);
      return(
        <Modal onClosed={this.close} isOpen={open} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}>{!newpassword ? password.site : "Add password"}</ModalHeader>
            <Form onSubmit={this.handleSubmit}>
                <ModalBody>
                <Label>Site name:</Label>
                <Input name="site" onChange={this.handleChange} readOnly={readonly} defaultValue={password.site}/>
                <Label>Username:</Label>
                <Input name="username" onChange={this.handleChange} readOnly={readonly} defaultValue={password.username}/>
                <Label>Password:</Label>
                <Input name="password" onChange={this.handleChange} readOnly={readonly} defaultValue={password.password}/>
                </ModalBody>
                <ModalFooter>
                <Button type="submit" color="primary">{buttontext}</Button>
                <Button color="secondary" onClick={this.props.toggle}>Close</Button>
                </ModalFooter>
            </Form>
        </Modal>
      )  
    }
}
export default PasswordModal;