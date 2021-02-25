import React, {Component} from 'react';
import { Spinner, Container, Form, Label, Input, Button } from 'reactstrap';
import Cookies from 'js-cookie';
class Home extends Component {
    emptyVar = {
        name: '',
        value: ''
    }
    constructor(props) {
        super(props);
        this.state = {vars: null, variable: this.emptyVar};
    }

    componentDidMount() {
        fetch('/api/session/variables/get')
        .then(response =>{
            if(response.ok) {
                response.json()
                .then(data => this.setState({vars: data}))
            } else {
                Cookies.remove('session');
                this.props.history.push('/');
            }
        })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let variable = {...this.state.variable};
        variable[name] = value;
        this.setState({variable});
        console.log(JSON.stringify(variable))
    }

    handleSubmit = () => {
        const {variable} = this.state;
        let {vars} = this.state;
        const varname = variable['name'];
        var reqbody = {};
        reqbody[varname] = variable['value'];
        fetch('/api/session/variables/set', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqbody)
        })
        .then(request => {
            if(request.ok) {
                vars[varname] = variable['value'];
                this.setState({vars: vars});
            }
        })
    }

    test = (event) => {
        event.preventDefault();
        const testbody = {
            name : 'leks secret identity'
        }
        fetch('/api/identity/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testbody)
        })
    }

    render() {
        const {vars} = this.state;
        if(vars == null) {
            return (
                <Container>
                <div class="d-flex align-items-center justify-content-center" style={{height: "95vh"}}>
                    <Spinner color="dark" />
                </div>
            </Container>
            )
        }
        const varstring = JSON.stringify(vars);
        return(
            <Container>
                <p>
                    {varstring}
                </p>
                <Form>
                    <h1>Add session variable</h1>
                    <Label>Variable name</Label>
                    <Input onSubmit={this.handleSubmit} onChange={this.handleChange} name="name" placeholder="name"/>
                    <Label>Variable value</Label>
                    <Input onSubmit={this.handleSubmit} onChange={this.handleChange} name="value" placeholder="value"/>
                    <Button onClick={this.handleSubmit} color="success">Submit</Button>
                </Form>
                <Form>
                    <h1>Add Identity</h1>
                    <Input onSubmit={this.test}/>
                    <Button onClick={this.test} color="success">Submit</Button>

                </Form>
            </Container>
        )
    }
}
export default Home;