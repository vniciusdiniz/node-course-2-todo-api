const ObjectID      = require('mongodb').ObjectID;

const {mongoose}    = require('./../server/db/mongoose');
const {Todo}        = require('./../server/models/todo');
const {User}        = require('./../server/models/user');

var id = '5ab1abceb0b9710dd4d4501d';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

Todo.findById(id).then((todo) => {
    if (!todo){
        return console.log('Id not found');
    }
    console.log('Todo By Id', todo);
}).catch((e) => console.log(e.message));


User.findById(`5ab0931f8d2e8d3ce4415c3a`).then((user) => {
    if (!user){
        return console.log('Unable to find user');
    }
    console.log(JSON.stringify(user, undefined, 2) ) ;
}).catch((e) => console.log(e.message));