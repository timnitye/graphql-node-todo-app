const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');


const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            todos: [String!]!
        }
        type RootMutation {
            createTodo(name: String): String
        }
        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `),
    rootValue: {
        todos: () => {
            return ['eat', 'drink', 'sleep'];
        },
        createTodo: (args) => {
            const todoName = args.name;
            return todoName;
        }
    },
    graphiql: true
}));

app.listen(3000);
