'use strict';

import React from 'react';
//import ReactDOM from 'react-dom';

import { Card, Row, Col, Form, Input, Button, message } from 'antd';

import { observer, inject } from 'mobx-react';
import { observable, action, toJS, autorun, extendObservable } from 'mobx';

import ApolloClient from 'apollo-boost';
const client = new ApolloClient({ uri: '/graphql' });
import gql from 'graphql-tag';

import { withRouter } from 'react-router';

const store = require('store');

@inject('appStore')
@observer
class This extends React.Component {
    constructor(props) {
        super(props);
        this.initial = toJS(this.dadosForm);
    }

    @observable dadosForm = {
        username: '',
        password: '',
    };

    changeInput = e => {
        this.dadosForm[e.target.name] = e.target.value;
    };

    loginClick = e => {
        console.log(toJS(this.dadosForm));
        client
            .mutate({
                mutation: gql`
                    mutation($input: JSON!) {
                        login(input: $input)
                    }
                `,
                variables: {
                    input: toJS(this.dadosForm),
                },
            })
            .then(res => {
                console.log(res.data.login);
                const { name, id } = res.data.login;
                message.success('Usuário logado com sucesso.');
                store.set('user', { id, name });
                this.props.appStore.user = { id, name };
                this.props.history.push('/');
                //this.dadosForm = this.initial;
            })
            .catch(err => {
                //console.log(`err->${err}`);
                //console.log(err.message, err.graphQLErrors);
                err.graphQLErrors.map(err => {
                    //console.log(err.message);
                    message.error(err.message);
                });
            });
    };

    render() {
        return (
            <div>
                {/* <h2>Cadastro</h2> */}
                <Card title="Cadastro">
                    <Form>
                        <Row>
                            <Col xs={24} sm={6}>
                                <Form.Item>
                                    <Input name="username" placeholder="Username" value={this.dadosForm.username} onChange={this.changeInput}></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} sm={6}>
                                <Form.Item>
                                    <Input name="password" placeholder="Password" type="password" value={this.dadosForm.password} onChange={this.changeInput}></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} sm={6}>
                                <Button type="primary" onClick={this.loginClick}>
                                    Login
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default withRouter(This);
