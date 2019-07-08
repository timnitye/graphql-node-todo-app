const { buildSchema } = require('graphql');

module.exports = buildSchema(`

        type Todo {
            _id: ID!
            title: String!
            description: String!
            image: String!
            isCompleted: Boolean!
            creator: User!
        }
        type User {
            _id: ID!
            username: String!
            displayname: String
            email: String!
            password: String
            createdTodos: [Todo!]
        }

        type Location {
            _id: ID!
            name: String!
            address: String
        }

        type Notification {
            _id: ID!
            userId: Int!
            message: String!
        }


        input TodoInput{
            title: String!
            description: String!
            image: String!
            isCompleted: Boolean!
        }
        input UserInput{
            username: String!
            displayname: String
            email: String!
            password: String!
        }

        type RootQuery {
            todos: [Todo!]!
            todo(_id: ID!): Todo!
            locations: [Location!]
            user(email: String, _id: ID!): User
        }

        type RootMutation {
            createTodo(todoInput: TodoInput): Todo
            updateTodo(_id: ID!, todoInput: TodoInput): Todo
            deleteTodo(_id: ID!): Todo

            createUser(userInput: UserInput): User
            updateUser(_id: ID!, userInput: UserInput): User
            deleteUser(_id: ID!): User
        }
        schema {
            query: RootQuery,
            mutation: RootMutation
        }
`)