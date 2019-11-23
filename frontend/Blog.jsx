'use strict';

import React from 'react';
//import ReactDOM from 'react-dom';

import { Card, Row, Col, Form, Input, Button, message, Table, Modal, Divider, Tree } from 'antd';

import { observer, inject } from 'mobx-react';
import { observable, action, toJS, autorun, extendObservable } from 'mobx';

const store = require('store');
const moment = require('moment');

import ApolloClient from 'apollo-boost';

// import { ApolloClient } from 'apollo-client';
// import { createHttpLink } from 'apollo-link-http';
// import { setContext } from 'apollo-link-context';
// import { InMemoryCache } from 'apollo-cache-inmemory';

// const httpLink = createHttpLink({
//     uri: '/graphql',
// });

// const authLink = setContext((_, { headers }) => {
//     // get the authentication token from local storage if it exists
//     const user = store.get('user');
//     // return the headers to the context so httpLink can read them
//     return {
//         headers: {
//             ...headers,
//             idUser: user ? user._id : null,
//         },
//     };
// });

// const client = new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache(),
// });

const client = new ApolloClient({
    uri: '/graphql',
    request: operation => {
        const user = store.get('user');
        operation.setContext({
            headers: {
                iduser: user ? user._id : null,
            },
        });
    },
});

import gql from 'graphql-tag';

const pageStore = {
    @observable post: null,
};

@inject('appStore')
@observer
class This extends React.Component {
    constructor(props) {
        super(props);
        this.initial = toJS(this.dadosForm);
    }

    changeInput = e => {
        this.dadosForm[e.target.name] = e.target.value;
    };

    @observable dadosForm = {
        _id: null,
        descricao: '',
    };

    @observable modalNovo = false;

    @observable dadosLista = [];

    updateLista = () => {
        client
            .query({
                query: gql`
                    query {
                        getBlogs
                    }
                `,
                fetchPolicy: 'no-cache',
            })
            .then(res => {
                this.dadosLista = res.data.getBlogs;
            })
            .catch(err => {
                console.log(`err->${err}`);
            });
    };

    novoClick = e => {
        this.modalNovo = true;
    };

    editClick = record => e => {
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
                this.dadosForm = res.data.getBlog;
                this.modalNovo = true;
            })
            .catch(err => {
                console.log(`err->${err}`);
            });
    };

    postClick = record => e => {
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
                // this.dadosForm = res.data.getBlog;
                pageStore.post = res.data.getBlog;
            })
            .catch(err => {
                console.log(`err->${err}`);
            });
    };

    atuClick = e => {
        this.updateLista();
    };

    componentDidMount() {
        this.updateLista();
    }

    render() {
        return (
            <div>
                <Card title="Blog">
                    <Button size="large" type="primary" onClick={this.novoClick}>
                        Novo
                    </Button>
                    &nbsp;
                    <Button size="large" onClick={this.atuClick}>
                        Atualizar
                    </Button>
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
                                width: '150px',
                                render: (text, record) => {
                                    return (
                                        <div style={{ textAlign: 'right' }}>
                                            <Button icon="edit" shape="circle" size="small" onClick={this.editClick(record)} />
                                            <Divider type="vertical" />
                                            <Button style={{ color1: 'green', borderColor1: 'green' }} icon1="copy" shape1="circle" size="small" onClick={this.postClick(record)}>
                                                Posts
                                            </Button>
                                        </div>
                                    );
                                },
                            },
                        ]}
                        dataSource={this.dadosLista}
                        rowKey="_id"
                        pagination={false}
                        // expandedRowRender={(record, a, b, expanded) => {
                        //     if (expanded) {
                        //         return (
                        //             <div>
                        //                 <Table
                        //                     columns={[
                        //                         {
                        //                             title: '#',
                        //                             dataIndex: '#',
                        //                             render: (text, record, k) => {
                        //                                 return <span>{k + 1}</span>;
                        //                             },
                        //                         },
                        //                         {
                        //                             title: 'Descrição',
                        //                             dataIndex: 'descricao',
                        //                         },
                        //                     ]}
                        //                 ></Table>
                        //             </div>
                        //         );
                        //     }
                        // }}
                    ></Table>
                </Card>
                <Modal
                    visible={this.modalNovo}
                    title="Blog"
                    onOk={e => {
                        //console.log(toJS(this.dadosForm));
                        client
                            .mutate({
                                mutation: gql`
                                    mutation($input: JSON!) {
                                        saveBlog(input: $input)
                                    }
                                `,
                                variables: {
                                    input: toJS(this.dadosForm),
                                },
                            })
                            .then(res => {
                                //console.log(res.data.saveUser);
                                message.success('Blog gravado com sucesso.');
                                this.dadosForm = this.initial;
                                this.modalNovo = false;
                                this.updateLista();
                            })
                            .catch(err => {
                                //console.log(`err->${err}`);
                                //console.log(err.message, err.graphQLErrors);
                                err.graphQLErrors.map(err => {
                                    //console.log(err.message);
                                    message.error(err.message);
                                });
                            });
                    }}
                    onCancel={e => {
                        this.dadosForm = this.initial;
                        this.modalNovo = false;
                    }}
                >
                    <Form>
                        <Row>
                            <Col xs={24} sm={24}>
                                <Form.Item>
                                    <Input name="descricao" placeholder="Descrição" value={this.dadosForm.descricao} onChange={this.changeInput}></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col xs={24} sm={6}>
                                <Button type="primary" onClick={this.gravarClick}>
                                    Gravar
                                </Button>
                            </Col>
                        </Row> */}
                    </Form>
                </Modal>
                <Posts></Posts>
            </div>
        );
    }
}

export default This;

@observer
class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.initial = toJS(this.dadosForm);
    }

    @observable dadosForm = {
        id: null,
        titulo: '',
        conteudo: '',
        subsecao: [],
    };

    @observable modalNovo = false;

    novoClick = e => {
        this.modalNovo = true;
    };

    changeInput = e => {
        this.dadosForm[e.target.name] = e.target.value;
    };

    editClick = record => e => {
        this.dadosForm = record;
        this.modalNovo = true;
    };

    updateLista = () => {};

    atuClick = e => {
        this.updateLista();
    };

    componentDidMount() {
        this.updateLista();
    }

    render() {
        return (
            <div>
                <Modal
                    width="100%"
                    visible={pageStore.post !== null}
                    title="Posts"
                    // onOk={e => {}}
                    onCancel={e => {
                        pageStore.post = null;
                    }}
                    footer={null}
                >
                    <Button size="large" type="primary" onClick={this.novoClick}>
                        Novo
                    </Button>
                    &nbsp;
                    <Button size="large" onClick={this.atuClick}>
                        Atualizar
                    </Button>
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
                                title: 'Título',
                                dataIndex: 'titulo',
                            },
                            {
                                title: 'Data/Hora',
                                dataIndex: 'dataHora',
                                render: (text, record, k) => {
                                    return <span>{moment(text).format('DD/MM/YY - HH:mm:ss')}</span>;
                                },
                            },
                            {
                                width: '150px',
                                render: (text, record, k) => {
                                    return (
                                        <div style={{ textAlign: 'right' }}>
                                            <Button icon="edit" shape="circle" size="small" onClick={this.editClick({ id: k, ...record })} />
                                        </div>
                                    );
                                },
                            },
                        ]}
                        dataSource={
                            pageStore.post &&
                            pageStore.post.posts.map((item, k) => {
                                item.id = k;
                                return item;
                            })
                        }
                        rowKey="id"
                        pagination={false}
                    ></Table>
                    <Modal
                        width="800px"
                        visible={this.modalNovo}
                        title="Post"
                        onOk={e => {
                            //return console.log(toJS(this.dadosForm));

                            const { id, ...resto } = toJS(this.dadosForm);
                            if (id === null) {
                                pageStore.post.posts.push(resto);
                            } else {
                                pageStore.post.posts[id] = resto;
                            }
                            client
                                .mutate({
                                    mutation: gql`
                                        mutation($input: JSON!) {
                                            savePost(input: $input)
                                        }
                                    `,
                                    variables: {
                                        input: toJS(pageStore.post),
                                        //input: {
                                        //idBlog: pageStore.post._id,
                                        //data: toJS(this.dadosForm),
                                        //},
                                    },
                                })
                                .then(res => {
                                    //console.log(res.data.saveUser);
                                    message.success('Post gravado com sucesso.');
                                    this.dadosForm = this.initial;
                                    this.modalNovo = false;
                                    this.updateLista();
                                })
                                .catch(err => {
                                    //console.log(`err->${err}`);
                                    //console.log(err.message, err.graphQLErrors);
                                    err.graphQLErrors.map(err => {
                                        //console.log(err.message);
                                        message.error(err.message);
                                    });
                                });
                        }}
                        onCancel={e => {
                            this.dadosForm = this.initial;
                            this.modalNovo = false;
                        }}
                    >
                        <Form>
                            <Row>
                                <Col xs={24} sm={24}>
                                    <Form.Item>
                                        <Input name="titulo" placeholder="Título" value={this.dadosForm.titulo} onChange={this.changeInput}></Input>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24}>
                                    <Form.Item>
                                        <Input name="conteudo" placeholder="Conteúdo" value={this.dadosForm.conteudo} onChange={this.changeInput}></Input>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24}>
                                    <SubSecao dados={this.dadosForm.subsecao}></SubSecao>
                                </Col>
                            </Row>
                            {/* <Row>
                            <Col xs={24} sm={6}>
                                <Button type="primary" onClick={this.gravarClick}>
                                    Gravar
                                </Button>
                            </Col>
                        </Row> */}
                        </Form>
                    </Modal>
                </Modal>
            </div>
        );
    }
}

@observer
class SubSecao extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    width: '100%',
                    //border: '1px solid red',
                    //marginLeft: '20px',
                }}
            >
                <Button
                    onClick={e => {
                        this.props.dados.push({
                            titulo: '',
                            conteudo: '',
                            subsecao: [],
                        });
                    }}
                >
                    Adicionar seção...
                </Button>
                <div
                    style={{
                        padding: 5,
                        paddingLeft: '20px',
                        //border: '1px red solid',
                    }}
                >
                    {this.props.dados.map((item, k) => {
                        return (
                            <div key={k}>
                                <Row>
                                    <Col xs={24} sm={24}>
                                        <Input placeholder="Título" value={item.titulo} onChange={e => (item.titulo = e.target.value)}></Input>
                                    </Col>
                                    <Col xs={24} sm={24}>
                                        <Input placeholder="Conteúdo" value={item.conteudo} onChange={e => (item.conteudo = e.target.value)}></Input>
                                    </Col>
                                    <Col xs={24} sm={24}>
                                        <SubSecao dados={item.subsecao}></SubSecao>
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
