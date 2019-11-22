'use strict';

import React from 'react';
//import ReactDOM from 'react-dom';

import { Card, Row, Col, Form, Input, Button, message, Divider } from 'antd';

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
        const { user } = this.props.appStore;
        return (
            <div>
                <h2>Bem-vindo {user ? user.name : 'Anônimo'}</h2>
            </div>
        );
    }
}

export default This;
