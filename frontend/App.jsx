'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { Card, Button, Input, Table } from 'antd';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Cadastro from './Cadastro';
import Login from './Login';
import Blog from './Blog';
import Home from './Home';
// import Testes from './Testes';
// import Testes2 from './Testes2';

import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;

import { withRouter } from 'react-router';

const store = require('store');

import { Provider, observer, inject } from 'mobx-react';
import { observable, action, toJS, autorun, extendObservable } from 'mobx';

const appStore = {
    @observable user: null,
};

@observer
class App extends React.Component {
    constructor(props) {
        super(props);
        appStore.user = store.get('user');
    }

    componentDidMount() {}

    render() {
        //console.log(this.props);
        //console.log(this.user);

        return (
            <Provider appStore={appStore}>
                <Router>
                    <Layout>
                        <Header style={{ position: 'fixed', zIndex1: 1, width: '100%' }}>
                            {/* <div className="logo" /> */}
                            <MainMenu />
                        </Header>
                        <Content style={{ padding: '10px 50px', marginTop: 64 }}>
                            {/* <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb> */}
                            <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                                <Switch>
                                    <Route exact path="/">
                                        {/* <div>
                                        <h2>Home</h2>
                                        <h3>Bem-vindo {appStore.user ? appStore.user.name : 'Anônimo'}</h3>
                                    </div> */}
                                        <Home />
                                    </Route>
                                    <Route path="/cadastro">
                                        <Cadastro />
                                    </Route>
                                    <Route path="/login">
                                        <Login />
                                    </Route>
                                    <Route path="/blog">
                                        <Blog />
                                    </Route>
                                    {/* <Route path="/testes">
                                    <Testes />
                                </Route>
                                <Route path="/testes2">
                                    <Testes2 />
                                </Route> */}
                                </Switch>
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>Atividade 4</Footer>
                    </Layout>
                </Router>
            </Provider>
        );
    }
}

export default App;

const MainMenu = observer(
    withRouter(
        class MainMenu extends React.Component {
            render() {
                //console.log(this.props.location.pathname);
                return (
                    <div>
                        {appStore.user ? (
                            <Menu theme="dark" mode="horizontal" selectedKeys={[this.props.location.pathname]} style={{ lineHeight: '64px' }}>
                                <Menu.Item key="/">
                                    <Link to="/">Home</Link>
                                </Menu.Item>
                                <Menu.Item key="/blog">
                                    <Link to="/blog">Blog</Link>
                                </Menu.Item>
                                {/* <Menu.Item key="/testes">
                            <Link to="/testes">Testes</Link>
                        </Menu.Item>
                        <Menu.Item key="/testes2">
                            <Link to="/testes2">Testes 2</Link>
                        </Menu.Item> */}
                                <Menu.Item key="/logout" style={{ float: 'right' }}>
                                    {/* <Link to="/logout">Logout</Link> */}
                                    <a
                                        onClick={e => {
                                            //e.stopPropagation();
                                            store.remove('user');
                                            appStore.user = null;
                                            this.props.history.push('/');
                                        }}
                                    >
                                        Logout
                                    </a>
                                </Menu.Item>
                            </Menu>
                        ) : (
                            <Menu theme="dark" mode="horizontal" selectedKeys={[this.props.location.pathname]} style={{ lineHeight: '64px' }}>
                                <Menu.Item key="/">
                                    <Link to="/">Home</Link>
                                </Menu.Item>
                                <Menu.Item key="/cadastro">
                                    <Link to="/cadastro">Cadastro</Link>
                                </Menu.Item>
                                <Menu.Item key="/login">
                                    <Link to="/login">Login</Link>
                                </Menu.Item>
                            </Menu>
                        )}
                    </div>
                );
            }
        }
    )
);
