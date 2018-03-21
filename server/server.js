//library imports
var express     = require('express');
var bodyParser  = require('body-parser');

//local imports
var {mongoose}  = require('./db/mongoose');
var {Todo}      = require('./models/todo');
var {User}      = require('./models/user');
var {ObjectID}  = require('mongodb');

var app         = express();

//middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if ( ObjectID.isValid(id) ){
        console.log("ok")
    }else {
        console.log("Invalid ID");
        res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.send(todo);
    }, (e) => {
        res.status(400).send();
    });

});

app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = { app };























// var otherTodo = new Todo({
//     text: "Brush teeth",
//     completed: true,
//     completedAt: 123
// });

// otherTodo.save().then((doc) => {
//     console.log("Saved todo", doc);
// }, (e) => {
//     console.log('Unable to save.');
// });

//trim, required text, minlength
// var otherTodo = new Todo({
//     text: "    Edit this video      "
// });

// otherTodo.save().then((doc) => {
//     console.log("Saved todo", doc);
// }, (e) => {
//     console.log('Unable to save.');
// });

// var user = new User({
//     email: "   vni@gmail.com      "
// });

// user.save().then((doc) => {
//     console.log("Saved user", doc);
// }, (e) => {
//     console.log('Unable to save.');
// });