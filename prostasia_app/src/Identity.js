import { isEmptyObject } from "jquery";
import React, { Component } from "react";
import { Container, Spinner, ListGroup, ListGroupItem, Button } from "reactstrap";
import PasswordModal from "./PasswordModal";


class Identity extends Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true, identities: null, password: Array, open: false, id: null}
    }

    componentDidMount = () => {
        fetch('/api/identity/get')
        .then(response => {
            if(response.ok) {
                response.json()
                .then(data => this.setState({identities: data, isLoading: false}));
            }
        })
    }

    toggle = (password, id) => {
        const {open} = this.state;
        this.setState({password: password, open: !open, id: id})
        console.log(password);
    }
    render() {
        const {isLoading, identities, open, password, id} = this.state;
        if(isLoading) {
            return(
                <Container>
                    <div class="d-flex align-items-center justify-content-center" style={{height: "95vh"}}>
                        <Spinner color="dark" />
                    </div>
                </Container>
            )
        }
        const passwordList = identities.map(identity => {
            if(identity['_id'] == this.props.match.params.id) {
                return(
                    <ListGroup>{identity.passwords.map(password => {
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
                    })}
                    </ListGroup>
                )
            }})
        return(
            <Container>
                <PasswordModal id={id} password={password} open={open} toggle={this.toggle}/>
                <h1>ziek neef</h1>
                {passwordList}
                <p>{'' + open}</p>
            </Container>
        )
    }
}
export default Identity;