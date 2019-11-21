'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { Card, Button, Input, Table } from 'antd';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Cadastro from './Cadastro';
import Login from './Login';
import Testes from './Testes';
import Testes2 from './Testes2';

import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;

import { withRouter } from 'react-router';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);

        return (
            <Router>
                <Layout>
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                        {/* <div className="logo" /> */}
                        <MainMenu />
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
                                <Route path="/testes2">
                                    <Testes2 />
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

const MainMenu = withRouter(
    class MainMenu extends React.Component {
        render() {
            console.log(this.props.location.pathname);

            return (
                <div>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[this.props.location.pathname]} style={{ lineHeight: '64px' }}>
                        <Menu.Item key="/">
                            <Link to="/">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="/cadastro">
                            <Link to="/cadastro">Cadastro</Link>
                        </Menu.Item>
                        <Menu.Item key="/login">
                            <Link to="/login">Login</Link>
                        </Menu.Item>
                        <Menu.Item key="/testes">
                            <Link to="/testes">Testes</Link>
                        </Menu.Item>
                        <Menu.Item key="/testes2">
                            <Link to="/testes2">Testes 2</Link>
                        </Menu.Item>
                    </Menu>
                </div>
            );
        }
    }
);
