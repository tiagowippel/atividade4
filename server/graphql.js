const GraphQLJSON = require('graphql-type-json');

const typeDefs = `

scalar JSON

type Query {
    teste: JSON
}

type Mutation {
    teste(input: String!): String
}

schema {
    query: Query
    mutation: Mutation
}

`;

const resolvers = {
    JSON: GraphQLJSON,
    Query: {
        teste(obj, args, context, info) {
            return new Promise((resolve, reject) => {
                resolve({
                    teste: [1, 2, 3],
                });
            });
        },
    },
    Mutation: {
        teste(obj, args, context, info) {
            return new Promise((resolve, reject) => {
                resolve('teste');
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
