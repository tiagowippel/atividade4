const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/atividade4', { useNewUrlParser: true });

const UserSchema = mongoose.Schema({ username: String, name: String, password: String });

const SecaoSchema = mongoose.Schema({ texto: String, subsecao: [this] });

const PostSchema = mongoose.Schema({
    titulo: String,
    dataHora: { type: Date, default: Date.now },
    conteudo: [SecaoSchema],
});
const BlogSchema = mongoose.Schema({ iDuser: String, descricao: String, posts: [PostSchema] });

const Usuario = mongoose.model('Usuario', UserSchema);
const Blog = mongoose.model('Blog', BlogSchema);
const Post = mongoose.model('Post', PostSchema);
const Secao = mongoose.model('Secao', SecaoSchema);

// const Blog = mongoose.model('Blog', {
//     descricao: String,
//     posts: [],
// });

// const user1 = new Usuario({ username: 'tiagowippel', name: 'Tiago Wippel' });

// user1.save().then(() => {
//     console.log('user1 salvo');
// });

// return Blog.find().then(blogs => {
//     console.log(JSON.stringify(blogs, null, 2));
// });

// Usuario.findOne({ username: 'tiagowippel' }).then(user => {
//     const blog1 = new Blog({
//         iDuser: user._id,
//         descricao: 'Blog Teste',
//         posts: [
//             new Post({
//                 titulo: 'post 1',
//                 dataHora: Date.now,
//                 conteudo: [
//                     new Secao({
//                         texto: 'texto 1',
//                     }),
//                     new Secao({
//                         texto: 'texto 2',
//                         subsecao: [
//                             new Secao({
//                                 texto: 'sub 1',
//                             }),
//                         ],
//                     }),
//                 ],
//             }),
//         ],
//     });
//     blog1.save().then(result => {
//         console.log(JSON.stringify(result));
//     });
// });

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
