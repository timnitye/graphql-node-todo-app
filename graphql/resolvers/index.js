const bcrypt = require('bcryptjs');

const Todo = require('../../models/todo');
const User = require('../../models/user');



const todos = todoIds => {
    return Todo.find({_id: {$in: todoIds}})
    .then(todos => {
        return todos.map(todo =>{
            return { 
                ...todo._doc, 
                _id: todo.id, 
                creator: user.bind(this, todo.creator)
            };
        });
    })
    .catch(err => {
        throw err;
    });
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc, 
                _id: user.id,
                createdTodos: todos.bind(this, user._doc.createdTodos)
            };
        })
        .catch(err =>{
            throw err;
        });
}


module.exports = {
    todos: () => {
       return Todo.find()
            .then(todos => {
                return todos.map(todo => {
                    return { 
                        ...todo._doc, 
                        _id: todo.id,
                        creator: user.bind(this, todo._doc.creator)
                    };
                });
            })
            .catch(err =>{
                throw err;
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
            isCompleted: args.todoInput.isCompleted,
            creator: '5d22bca1ebe9584b55283860'
        }); 
        let createdTodo;
        return todo
        .save()
        .then(result => {
            createdTodo = { 
                ...result._doc, 
                _id:result._doc._id.toString(),
                creator: user.bind(this, result._doc.creator) 
            }; 
            return User.findById('5d22bca1ebe9584b55283860')                
        })
        .then(user => {
            if (!user){
                throw new Error('User not found.')
            }
            user.createdTodos.push(todo);
            return user.save();
        })
        .then(result => {
            return createdTodo;
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
}