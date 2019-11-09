'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { Card, Button, Input, Table } from 'antd';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Cadastro from './Cadastro';
import Login from './Login';
import Testes from './Testes';

import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Layout>
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                        {/* <div className="logo" /> */}
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
                            <Menu.Item key="1">
                                <Link to="/">Home</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/cadastro">Cadastro</Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/login">Login</Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Link to="/testes">Testes</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{ padding: '0 50px', marginTop: 64 }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item> */}
                        </Breadcrumb>
                        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                            <Switch>
                                <Route path="/cadastro">
                                    <Cadastro />
                                </Route>
                                <Route path="/login">
                                    <Login />
                                </Route>
                                <Route path="/testes">
                                    <Testes />
                                </Route>
                                <Route path="/">
                                    <div>Home</div>
                                </Route>
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Atividade 4</Footer>
                </Layout>
            </Router>
        );
    }
}

export default App;
