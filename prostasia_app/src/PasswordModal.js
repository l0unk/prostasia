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
        this.state = {readonly: false, password: this.emptyPassword, buttonlabel: "Edit", newpassword: true, nickname: this.props.password.nickname};
    }

    componentDidMount = () => {
    } 

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let password = {...this.state.password};
        password[name] = value;
        this.setState({password});
        console.log(JSON.stringify(password));
    }

    handleSubmit = (event) => {
        event.preventDefault();
        var {password, stateidentity} = this.state;
        const {newpassword} = this.props;
        if(!newpassword) {
            password._id = this.props.password._id;
        }
        var identity = this.emptyIdentity;
        identity.passwords.push(password);
        fetch('/api/identity/' + this.props.id + '/set', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(identity)
        })
        .then(response => {
            if(response.ok) {
                //do shit
                if(newpassword) {
                    response.json()
                    .then(data => {
                        const password = data[0];
                        this.props.update(password);
                        this.props.toggle();
                    })
                }
            } else if(response.status == 403) {
                this.props.history.push('/');
            } else {
                //error handling
            }
        });
    }

    updatenickname = (event) => {
        this.handleChange(event);
        this.setState({nickname: event.target.value});
    }

    close = () => {
        this.setState({readonly: false, password: this.emptyPassword, buttonlabel: "Edit", newpassword: true, nickname: this.props.password.nickname});
    }

    render() {
        const {readonly, buttonlabel} = this.state;
        var {nickname} = this.state;
        if(nickname == undefined) {
            nickname = this.props.password.nickname;
        }
        const {newpassword, password} = this.props;
      return(
        <Modal onClosed={this.close} isOpen={this.props.open} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}>{newpassword ? "Add new password" : nickname}</ModalHeader>
            <Form onSubmit={this.handleSubmit}>
                <ModalBody>
                <Label>Nickname:</Label>
                <Input name="nickname" onChange={this.updatenickname} readOnly={readonly} defaultValue={password.nickname}/>
                <Label>Site name:</Label>
                <Input name="site" onChange={this.handleChange} readOnly={readonly} defaultValue={password.site}/>
                <Label>Username:</Label>
                <Input name="username" onChange={this.handleChange} readOnly={readonly} defaultValue={password.username}/>
                <Label>Password:</Label>
                <Input name="password" onChange={this.handleChange} readOnly={readonly} defaultValue={password.password}/>
                </ModalBody>
                <ModalFooter>
                <Button type="submit" color="primary">{buttonlabel}</Button>
                <Button color="secondary" onClick={this.props.toggle}>Close</Button>
                </ModalFooter>
            </Form>
        </Modal>
      )  
    }
}
export default PasswordModal;