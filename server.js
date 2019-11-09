'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
//const sslRedirect = require('heroku-ssl-redirect');

const colors = require('colors');

const app = express();

//app.use(sslRedirect());

const loggingMiddleware = (req, res, next) => {
    //console.log(req.headers);
    console.log('ip:', req.ip, req.url);
    next();
};

app.use(loggingMiddleware);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

const graphql = require('./server/graphql')();

const { AuthenticationError } = require('apollo-server');

const { ApolloServer, gql } = require('apollo-server-express');
const server = new ApolloServer({
    typeDefs: graphql.typeDefs,
    resolvers: graphql.resolvers,
    //context: ({ req }) => {},
});
server.applyMiddleware({ app });

const api = require('./server/api');
app.use('/api', api);

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const srv = app.listen(process.env.PORT || 3000);
srv.setTimeout(10 * 60 * 1000);
