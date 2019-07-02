const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');


const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Todo {
            id: ID!
            name: String!
            content: String!
            image: String!
            location: Location! 
            isCompleted: Boolean!
        }

        type User {
            id: ID!
            username: String!
            displayname: String!
        }

        type Location {
            id: ID!
            name: String!
            address: String!
        }

        type Notification {
            id: ID!
            userId: Int!
            message: String!
        }

        type RootQuery {
            allTodos: [Todo!]!
            Todo(id: ID!): Todo!
            allLocations: [Location!]
        }

        type RootMutation {
            createTodo(name: String!, content: String!, image: String!, location: Location!, isCompleted: Boolean!): Todo!
            updateTodo(id: ID!, name: String!, image: String!, content: String, isCompleted: Boolean): Todo!
            deleteTodo(id: ID!): Todo!
        }
        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `),

    rootValue: {

        // will come back to this later

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
