const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Todo = require('./models/todo');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Todo {
            _id: ID!
            title: String!
            description: String!
            image: String!
            isCompleted: Boolean!
        }

        type User {
            _id: ID!
            username: String!
            displayname: String!
            email: String!
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

        type RootQuery {
            todos: [Todo!]!
            todo(_id: ID!): Todo!
            locations: [Location!]
            user(email: String, _id: Int): User
        }

        type RootMutation {
            createTodo(todoInput: TodoInput): Todo
            updateTodo(_id: ID!, name: String!, description: String, image: String!, isCompleted: Boolean): Todo
            deleteTodo(_id: ID!): Todo
        }
        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `),

    rootValue: {

        todos: () => {
           return Todo.find()
                .then(todos => {
                    return todos.map(todo => {
                        return { ...todo._doc, _id: todo._doc._id.toString() };
                    });
                })
                .catch(err =>{
                    
                });
        },
        todo: (args) => {
            Todo.find({
                _id: args.id
            });
        },
        createTodo: (args) => {
            const todo = new Todo({
                title: args.todoInput.title,
                description: args.todoInput.description,
                image: args.todoInput.image, 
                isCompleted: new Boolean(args.todoInput.isCompleted)
            });
            
            return todo
            .save()
            .then(result => {
                console.log(result);
                return { ...result._doc, _id:result._doc._id.toString() };
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
        },
        updateTodo: args => {

        },
        deleteTodo: args => {
         
        }
    },
    graphiql: true
}));


mongoose.connect(
    `mongodb+srv://${
        process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@cluster0-gje3f.mongodb.net/${
        process.env.MONGO_DB
    }?retryWrites=true&w=majority`
)
.then(() =>{
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});


