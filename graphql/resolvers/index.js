const bcrypt = require('bcryptjs');

const Todo = require('../../models/todo');
const User = require('../../models/user');



const todos = async todoIds => {
    try{
        const todos =  await Todo.find({_id: {$in: todoIds}})
        todos.map(todo =>{
            return { 
                ...todo._doc, 
                _id: todo.id, 
                creator: user.bind(this, todo.creator)
            };
        });
        return todos;
    } catch (err){
        throw err;
    }
}

const user = async userId => {
    try{
        const user = await User.findById(userId)
            return {
                ...user._doc, 
                _id: user.id,
                createdTodos: todos.bind(this, user._doc.createdTodos)
            };
    }catch(err){
        throw err;
    }
    
}


module.exports = {
    todos: async () => {
        try{
            const todos = await Todo.find()
            return todos
                .map(todo => {
                    return { 
                        ...todo._doc, 
                        _id: todo.id,
                        creator: user.bind(this, todo._doc.creator)
                    };
            });
          
        } catch (err){
            throw err;
        }
    },
    todo: (args) => {
        Todo.find({
            _id: args.id
        });
    },
    createTodo: async args => {
        const todo = new Todo({
            title: args.todoInput.title,
            description: args.todoInput.description,
            image: args.todoInput.image,
            isCompleted: args.todoInput.isCompleted,
            creator: '5d22feb76820a9622ce6b443' // 5d22bca1ebe9584b55283860
        }); 
        let createdTodo;
        try{
            const result = await todo.save();
            createdTodo = { 
                ...result._doc, 
                _id:result._doc._id.toString(),
                creator: user.bind(this, result._doc.creator) 
            }; 

            const creator = await User.findById('5d22feb76820a9622ce6b443')  

            if (!creator){
                throw new Error('User not found.')
            }

            creator.createdTodos.push(todo);
            await creator.save();

            return createdTodo;
        
        } catch(err){
            throw err;
        }
    },
    updateTodo: args => {

    },
    deleteTodo: args => {
     
    },

    createUser: async args => {
        try{
            const existingUser = await User.findOne({ email:args.userInput.email })
            if (existingUser){
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const user = new User({
                username: args.userInput.username,
                displayname: args.userInput.displayname,
                email: args.userInput.email,
                password: hashedPassword 
            })

            const result = await user.save();

            return { ...result._doc, password: null, _id:result.id  };
   
        } catch (err){
            throw err;
        }
        
    }
}