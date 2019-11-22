'use strict';

import React from 'react';
//import ReactDOM from 'react-dom';

import { Card, Row, Col, Form, Input, Button, message, Table } from 'antd';

import { observer, inject } from 'mobx-react';
import { observable, action, toJS, autorun, extendObservable } from 'mobx';

import ApolloClient from 'apollo-boost';

const client = new ApolloClient({ uri: '/graphql' });

import gql from 'graphql-tag';

@inject('appStore')
@observer
class This extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Card title="Blog">
                    <Table
                        columns={[
                            {
                                //title: '#',
                                dataIndex: '#',
                                render: (text, record, k) => {
                                    return <span>{k}</span>;
                                },
                            },
                            {
                                title: 'Descrição',
                                dataIndex: 'descricao',
                            },
                            {
                                render: (text, record, k) => {
                                    return <span>{k}</span>;
                                },
                            },
                        ]}
                        dataSource={[
                            {
                                id: 123,
                                descricao: 'sdfgd df gfdh df ghfg',
                            },
                        ]}
                        rowKey="id"
                    ></Table>
                </Card>
            </div>
        );
    }
}

export default This;
