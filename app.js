const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const Todo = require('./models/todo');
const User = require('./models/user');

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
            displayname: String
            email: String!
            password: String
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
        createTodo: args => {
            const todo = new Todo({
                title: args.todoInput.title,
                description: args.todoInput.description,
                image: args.todoInput.image,
                isCompleted: args.todoInput.isCompleted
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
         
        },

        createUser: args => {
            return User.findOne({ email:args.userInput.email }).then( user => {
                if (user){
                    throw new Error('User exists already.')
                }
                return bcrypt
                .hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    username: args.userInput.username,
                    displayname: args.userInput.displayname,
                    email: args.userInput.email,
                    password: hashedPassword 
                });
                return user.save();
            })
            .then(result => {
                return { ...result._doc, password: null, _id:result.id  };
            })
            .catch(err => {
                throw err;
            });
            
        }
    },
    graphiql: true
}));

//connect to MongoDB Atlas (Cloud DB)
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


