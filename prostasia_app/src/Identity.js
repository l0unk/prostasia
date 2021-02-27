import { isEmptyObject } from "jquery";
import React, { Component } from "react";
import { Container, Spinner, ListGroup, ListGroupItem, Button } from "reactstrap";
import PasswordModal from "./PasswordModal";


class Identity extends Component {
    emptyPassword = {
        site: '',
        username: '',
        password: ''
    }
    constructor(props) {
        super(props);
        this.state = {isLoading: true, identities: null, password: Array, open: false, opennew: false, id: null}
    }

    componentDidMount = () => {
        const _id = this.props.match.params.id;
        if(this.props.location.state != undefined && this.props.location.state.identity != undefined) {
            this.setState({identity: this.props.location.state.identity, isLoading: false});
            console.log('hi');
            return;
        }
        fetch('/api/identity/get')
        .then(response => {
            if(response.ok) {
                response.json()
                .then(data => {
                    this.setState({identities: data});
                    const identities = data;
                    console.log(identities);
                    identities.map(identity => {
                        if(identity._id == _id) {
                            this.setState({identity: identity})
                            return;
                        }
                    })
                    this.setState({isLoading: false});
                });
            }
        });
    }

    toggle = (password, id) => {
        const {open} = this.state;
        this.setState({password: password, open: !open, id: id})
    }

    toggleNew = (id) => {
        const {opennew} = this.state;
        this.setState({password: this.emptyPassword, opennew: !opennew, id: id})
    }
    render() {
        const {isLoading, open, password, id, identity, opennew} = this.state;
        if(isLoading) {
            return(
                <Container>
                    <div class="d-flex align-items-center justify-content-center" style={{height: "95vh"}}>
                        <Spinner color="dark" />
                    </div>
                </Container>
            )
        }
        if(identity == undefined) {
            return(
                <Container>
                    <h1>I'm sorry but we couldn't find that identity...</h1>
                </Container>
            )
        }

            const passwordList = identity.passwords.map(password => {
                return (
                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                        <div>
                            {password.site}
                            <p class="mb-2 text-muted">{password.username}</p>
                        </div>
                        <Button onClick={() => {
                            this.toggle(password, identity._id);
                        }} color="dark">View</Button>
                    </ListGroupItem>
                )
            })
        return(
            <Container>
                <PasswordModal id={id} password={password} open={open} toggle={this.toggle}/>
                <h1>{identity == null ? "" : identity.identityLabel}</h1>
                <PasswordModal id={id} password={this.emptyPassword} open={opennew} toggle={this.toggleNew}/>
                <Button onClick={() => {
                            this.toggle(identity._id);
                        }} color="dark">Add password</Button>
                <ListGroup>
                    {passwordList}
                </ListGroup>
                <p>{'' + open}</p>
            </Container>
        )
    }
}
export default Identity;