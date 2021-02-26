import React, { Component } from "react";
import {Button, Container, Form, Input, Jumbotron, Label, Spinner} from 'reactstrap';
import Cookies from 'js-cookie';

class Login extends Component {
    emptyUser = {
        username: '',
        password: ''
    }

    constructor(props) {
        super(props);
        this.state = {user: this.emptyUser, isLoading: true, error: null, loggedIn: false};
    }


    componentDidMount() {
        this.setState({isLoading: false});
        fetch('/api/auth')
        .then(response => response.json())
        .then(data => console.log(data));
        if(Cookies.get('session') != undefined) {
            fetch('/api/session/variables/get')
            .then(response => {
                if(response.ok) {
                    this.setState({loggedIn: true});
                } else {
                    Cookies.remove('session');
                }
            })
            .then(this.setState({isLoading: false}));
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let user = {...this.state.user};
        user[name] = value;
        this.setState({user});
    }

    handleSubmit = (event) => {
        event.preventDefault(true);
        const {user} = this.state;
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(user)
        })
        .then(response => {
            if(response.ok) {
                response.json()
                .then(data => Cookies.set('session', data))
                .then(this.props.history.push('/home'));
            } else if(response.status == 403) {
                this.setState({error: "Incorrect username/password"});
            } else {
                this.setState({error: "An unknown error has occurred"});
            }
        });
    }

    render() {
        const {error, isLoading, loggedIn} = this.state;
        if(isLoading) {
            return(
                <Container>
                    <div class="d-flex align-items-center justify-content-center" style={{height: "95vh"}}>
                        <Spinner color="dark" />
                    </div>
                </Container>
            )
        }
        if(loggedIn) {
            this.props.history.push('/home');
        }
        return(
        <Container>
            <Form onSubmit={this.handleSubmit}>
                <Label for="username">Username:</Label>
                <Input onChange={this.handleChange} type="text" name="username" placeholder="username"/>
                <Label for="password">Password:</Label>
                <Input onChange={this.handleChange} type="password" name="password" placeholder="password"/>
                <Button type="submit" className="mt-3" color="success">Log in</Button>
            </Form>
            <p class="text-danger">{error}</p>
        </Container>
        )
    }
}

export default Login;