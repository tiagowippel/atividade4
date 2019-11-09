'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { Card, Button, Input, Table } from 'antd';

import ApolloClient from 'apollo-boost';

import gql from 'graphql-tag';

const client = new ApolloClient({ uri: '/graphql' });

import { observer, inject } from 'mobx-react';

import { observable, action, toJS, autorun, extendObservable } from 'mobx';

@observer
class App extends React.Component {
    constructor(props) {
        super(props);
    }

    @observable dadosForm = {
        _id: '',
        username: '',
        name: '',
    };

    @observable dadosLista = [];

    render() {
        return (
            <div
                style={{
                    border: '1px solid red',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Card title="Usuários" style={{ flex: 1, width1: 300 }}>
                    <div>
                        <Input
                            value={this.dadosForm.username}
                            onChange={e => {
                                this.dadosForm.username = e.target.value;
                            }}
                            placeholder="username"
                        ></Input>
                        <Input
                            value={this.dadosForm.name}
                            onChange={e => {
                                this.dadosForm.name = e.target.value;
                            }}
                            placeholder="name"
                        ></Input>
                        <Button
                            onClick={e => {
                                console.log(toJS(this.dadosForm));
                                client
                                    .mutate({
                                        mutation: gql`
                                            mutation($input: JSON!) {
                                                saveUser(input: $input)
                                            }
                                        `,
                                        variables: {
                                            input: toJS(this.dadosForm),
                                        },
                                    })
                                    .then(res => {
                                        console.log(res.data.saveUser);
                                        this.dadosForm = {
                                            _id: '',
                                            username: '',
                                            name: '',
                                        };
                                    })
                                    .catch(err => {
                                        console.log(`err->${err}`);
                                    });
                            }}
                        >
                            gravar
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={e => {
                                client
                                    .query({
                                        query: gql`
                                            query {
                                                getUsers
                                            }
                                        `,
                                        fetchPolicy: 'no-cache',
                                    })
                                    .then(res => {
                                        console.log(res.data.getUsers);
                                        this.dadosLista = res.data.getUsers;
                                    })
                                    .catch(err => {
                                        console.log(`err->${err}`);
                                    });
                            }}
                        >
                            atualizar
                        </Button>
                        <Table
                            columns={[
                                {
                                    dataIndex: 'username',
                                    title: 'username',
                                },
                                {
                                    dataIndex: 'name',
                                    title: 'name',
                                },
                                {
                                    render: record => {
                                        //return <h1>{record._id}</h1>;
                                        return (
                                            <Button
                                                onClick={e => {
                                                    client
                                                        .query({
                                                            query: gql`
                                                                query($id: String!) {
                                                                    getUser(id: $id)
                                                                }
                                                            `,
                                                            fetchPolicy: 'no-cache',
                                                            variables: {
                                                                id: record._id,
                                                            },
                                                        })
                                                        .then(res => {
                                                            console.log(res.data.getUser);
                                                            this.dadosForm = res.data.getUser;
                                                        })
                                                        .catch(err => {
                                                            console.log(`err->${err}`);
                                                        });
                                                }}
                                            >
                                                editar
                                            </Button>
                                        );
                                    },
                                },
                            ]}
                            dataSource={this.dadosLista}
                            rowKey="_id"
                        ></Table>
                    </div>
                </Card>
                <Card title="Teste" style={{ width1: 300 }}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={e => {
                            // return client
                            //     .query({
                            //         query: gql`
                            //             query {
                            //                 getPosts
                            //             }
                            //         `,
                            //         fetchPolicy: 'no-cache',
                            //     })
                            //     .then(res => {
                            //         console.log(res.data.getPosts);
                            //     })
                            //     .catch(err => {
                            //         console.log(`err->${err}`);
                            //     });

                            client
                                .query({
                                    query: gql`
                                        query {
                                            teste
                                        }
                                    `,
                                    fetchPolicy: 'no-cache',
                                })
                                .then(res => {
                                    console.log(res.data.teste);
                                })
                                .catch(err => {
                                    console.log(`err->${err}`);
                                });

                            client
                                .mutate({
                                    mutation: gql`
                                        mutation($input: String!) {
                                            teste(input: $input)
                                        }
                                    `,
                                    variables: {
                                        input: '123',
                                    },
                                })
                                .then(res => {
                                    console.log(res.data.teste);
                                })
                                .catch(err => {
                                    console.log(`err->${err}`);
                                });
                        }}
                    >
                        teste
                    </Button>
                </Card>
            </div>
        );
    }
}

export default App;
