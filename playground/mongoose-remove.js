const ObjectID      = require('mongodb').ObjectID;

const {mongoose}    = require('./../server/db/mongoose');
const {Todo}        = require('./../server/models/todo');
const {User}        = require('./../server/models/user');


// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({_id: "5ab1ebdd26311c8a78f28cca"}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove("5ab1ebdd26311c8a78f28cca").then((todo) => {
    console.log(todo);
});