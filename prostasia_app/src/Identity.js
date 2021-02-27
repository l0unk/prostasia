import { isEmptyObject } from "jquery";
import React, { Component } from "react";
import { Container, Spinner, ListGroup, ListGroupItem, Button, Card, CardImg, CardBody, CardTitle, CardText, CardSubtitle, Col, Row, CardColumns } from "reactstrap";
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

    updateIdentity = (password) => {
        var {identity} = this.state;
        identity.passwords.push(password);
        this.setState({identity: identity});
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
                    <Card>
                        <Row>
                            <Col className="mx-auto d-flex align-items-center" md="2">
                                <CardImg width="100%" src={"https://icons.bitwarden.net/" + password.site + "/icon.png"} alt="Card image cap" />
                            </Col>
                            <Col md="8">
                                <CardBody>
                                <CardTitle tag="h5">{password.nickname}</CardTitle>
                                <CardSubtitle tag="h6" className="text-muted">{password.site}</CardSubtitle>
                                <CardText >{password.username}</CardText>
                                <Button onClick={() => {
                                        this.toggle(password, identity._id);
                                    }} color="dark">View
                                </Button>
                                </CardBody>
                            </Col>
                        </Row>
                    </Card>
                )
            })
            console.log(opennew);
        return(
            <Container>
                <PasswordModal id={id} password={password} open={open} toggle={this.toggle}/>
                <h1>{identity == null ? "" : identity.identityLabel}</h1>
                <PasswordModal update={this.updateIdentity} newpassword={opennew} id={id} password={this.emptyPassword} open={opennew} toggle={this.toggleNew}/>
                <Button onClick={() => {
                            this.toggleNew(identity._id);
                        }} color="dark">Add password</Button>
                <CardColumns>
                    {passwordList}
                </CardColumns>
                <p>{'' + open}</p>
            </Container>
        )
    }
}
export default Identity;