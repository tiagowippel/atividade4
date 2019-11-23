'use strict';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/atividade4', { useNewUrlParser: true });

const UserSchema = mongoose.Schema({ username: String, name: String, password: String });

const SecaoSchema = mongoose.Schema({ titulo: String, conteudo: String, subsecao: [this] });

const PostSchema = mongoose.Schema({
    dataHora: { type: Date, default: Date.now },
    titulo: String,
    conteudo: String,
    subsecao: [SecaoSchema],
});
const BlogSchema = mongoose.Schema({ idUser: String, descricao: String, posts: [PostSchema] });

const User = mongoose.model('User', UserSchema);
const Blog = mongoose.model('Blog', BlogSchema);
const Post = mongoose.model('Post', PostSchema);
const Secao = mongoose.model('Secao', SecaoSchema);

// const Blog = mongoose.model('Blog', {
//     descricao: String,
//     posts: [],
// });

// const user1 = new User({ username: 'tiagowippel', name: 'Tiago Wippel' });

// user1.save().then(() => {
//     console.log('user1 salvo');
// });

// return Blog.find().then(blogs => {
//     console.log(JSON.stringify(blogs, null, 2));
// });

// User.findOne({ username: 'tiagowippel' }).then(user => {
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

const GraphQLJSON = require('graphql-type-json');

const typeDefs = `

    scalar JSON

    type Query {
        #teste: JSON
        #getUsers: JSON
        #getUser(id: String!): JSON
        getBlogs: JSON
        getBlogsHome: JSON
        getBlog(id: String!): JSON
    }

    type Mutation {
        #saveUser(input: JSON!): JSON
        saveUser(input: JSON!): JSON
        saveBlog(input: JSON!): JSON
        savePost(input: JSON!): JSON
        login(input: JSON!): JSON
    }

    schema {
        query: Query
        mutation: Mutation
    }

`;

const resolvers = {
    JSON: GraphQLJSON,
    Query: {
        // teste(obj, args, context, info) {
        //     return new Promise((resolve, reject) => {
        //         resolve({
        //             teste: [1, 2, 3],
        //         });
        //     });
        // },
        // getPosts(obj, args, context, info) {
        //     return Blog.find();
        // },
        // getUsers(obj, args, context, info) {
        //     return User.find();
        // },
        // getUser(obj, args, context, info) {
        //     return User.findById(args.id);
        // },
        getBlogs(obj, args, context, info) {
            return Blog.find(
                {
                    idUser: context.idUser,
                },
                null,
                { lean: true }
            ).then(blogs => {
                return blogs;
            });
        },
        getBlogsHome(obj, args, context, info) {
            return Blog.aggregate([
                // {
                //     $lookup: {
                //         from: 'users',
                //         localField: 'idUser',
                //         foreignField: '_id',
                //         as: 'usuario',
                //     },
                // },
                {
                    $unwind: {
                        path: '$posts',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        descricao: { $first: '$descricao' },
                        dataHora: { $first: '$posts.dataHora' },
                        usuario: { $first: '$usuario' },
                    },
                },
                {
                    $sort: { dataHora: -1 },
                },
            ]);
            // .then(lll => {
            //     console.log(lll);
            // });
        },
        getBlog(obj, args, context, info) {
            return Blog.findById(args.id);
        },
    },
    Mutation: {
        // teste(obj, args, context, info) {
        //     return new Promise((resolve, reject) => {
        //         resolve({ resultado: args.input * 2 });
        //     });
        // },
        // saveUser(obj, args, context, info) {
        //     //const { _id, ...resto } = args.input;
        //     if (args.input._id === '') {
        //         delete args.input._id;
        //         const user = new User(args.input);
        //         return user.save();
        //     } else {
        //         return User.update({ _id: args.input._id }, args.input);
        //         //return User.findById(args.input._id).then(user => {
        //         //user.username = args.username;
        //         //user.name = args.name;
        //         // Object.assign(user, args.input);
        //         // return user.save();
        //         //});
        //     }
        // },
        saveUser(obj, args, context, info) {
            //console.log(args);

            const { username, name, password } = args.input;

            if (username === '' || name === '' || password === '') {
                throw new Error('Erros no formulário.');
            }

            return User.findOne({ username }).then(user => {
                if (user !== null) {
                    throw new Error('Usuário já existe.');
                }
                return User.create({
                    username,
                    name,
                    password,
                }).then(user => {
                    return {
                        ok: true,
                    };
                });
            });
        },
        saveBlog(obj, args, context, info) {
            //console.log(args);

            const { _id, descricao } = args.input;

            if (descricao === '') {
                throw new Error('Erros no formulário.');
            }

            return _id === null
                ? Blog.create({
                      idUser: context.idUser,
                      descricao,
                  })
                : Blog.updateOne(
                      { _id },
                      {
                          descricao,
                      }
                  ).then(blog => {
                      return {
                          ok: true,
                      };
                  });
        },
        savePost(obj, args, context, info) {
            //console.log(args);

            const { _id, ...resto } = args.input;

            // if (titulo === '') {
            //     throw new Error('Erros no formulário.');
            // }

            return Blog.updateOne({ _id }, resto).then(blog => {
                return {
                    ok: true,
                };
            });
        },
        login(obj, args, context, info) {
            //console.log(args);

            const { username, password } = args.input;

            if (username === '' || password === '') {
                throw new Error('Erros no formulário.');
            }

            return User.findOne({ username }, null, { lean: true }).then(user => {
                if (user === null) {
                    throw new Error('Usuário não encontrado.');
                }
                if (user.password !== password) {
                    throw new Error('Senha incorreta.');
                }
                return user;
            });
        },
    },
};

module.exports = () => {
    return {
        typeDefs,
        resolvers,
    };
};
