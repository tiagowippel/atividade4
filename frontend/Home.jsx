'use strict';

import React from 'react';
//import ReactDOM from 'react-dom';

import { Card, Row, Col, Form, Input, Button, message, Table, Modal, Divider, Tree } from 'antd';

import { observer, inject } from 'mobx-react';
import { observable, action, toJS, autorun, extendObservable } from 'mobx';

import ApolloClient from 'apollo-boost';

const client = new ApolloClient({ uri: '/graphql' });

const moment = require('moment');

import gql from 'graphql-tag';

@inject('appStore')
@observer
class This extends React.Component {
    constructor(props) {
        super(props);
    }

    @observable dadosLista = [];

    @observable dadosBlog = null;

    componentDidMount() {
        client
            .query({
                query: gql`
                    query {
                        getBlogsHome
                    }
                `,
                fetchPolicy: 'no-cache',
            })
            .then(res => {
                //return console.log(res.data.getBlogsHome);
                this.dadosLista = res.data.getBlogsHome;
            })
            .catch(err => {
                console.log(`err->${err}`);
            });
    }

    render() {
        const { user } = this.props.appStore;
        return (
            <div>
                <h2>Bem-vindo {user ? user.name : 'Anônimo'}</h2>
                <div>
                    <Table
                        columns={[
                            {
                                width: '50px',
                                title: '#',
                                dataIndex: '#',
                                render: (text, record, k) => {
                                    return <span>{k + 1}</span>;
                                },
                            },
                            {
                                title: 'Descrição',
                                dataIndex: 'descricao',
                            },
                            {
                                title: 'Usuário',
                                dataIndex: 'usuario',
                            },
                            {
                                title: 'Data/Hora Último Post',
                                dataIndex: 'dataHora',
                                render: (text, record, k) => {
                                    return <span>{text && moment(text).format('DD/MM/YY - HH:mm:ss')}</span>;
                                },
                            },
                            {
                                width: '150px',
                                render: (text, record, k) => {
                                    return (
                                        <div style={{ textAlign: 'right' }}>
                                            <Button
                                                icon="folder-open"
                                                shape="circle"
                                                size="small"
                                                onClick={e => {
                                                    client
                                                        .query({
                                                            query: gql`
                                                                query($id: String!) {
                                                                    getBlog(id: $id)
                                                                }
                                                            `,
                                                            fetchPolicy: 'no-cache',
                                                            variables: {
                                                                id: record._id,
                                                            },
                                                        })
                                                        .then(res => {
                                                            this.dadosBlog = res.data.getBlog;
                                                        })
                                                        .catch(err => {
                                                            console.log(`err->${err}`);
                                                        });
                                                }}
                                            />
                                        </div>
                                    );
                                },
                            },
                        ]}
                        dataSource={this.dadosLista}
                        rowKey="_id"
                        pagination={false}
                    ></Table>
                    <Modal
                        width="800px"
                        visible={this.dadosBlog !== null}
                        title={this.dadosBlog && this.dadosBlog.descricao}
                        // onOk={e => {}}
                        onCancel={e => {
                            this.dadosBlog = null;
                        }}
                        footer={null}
                    >
                        {/* <div>{this.dadosBlog && this.dadosBlog.descricao}</div> */}
                        <div>
                            {this.dadosBlog && (
                                <ul>
                                    {this.dadosBlog.posts.map((item, k) => {
                                        return <li key={k}>{item.titulo}</li>;
                                    })}
                                </ul>
                            )}
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default This;
