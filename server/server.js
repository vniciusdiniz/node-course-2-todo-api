//library imports
const _         = require('lodash');
const express   = require('express');
const bodyParser= require('body-parser');

//local imports
require('./config/config.js');
var {mongoose}  = require('./db/mongoose');
var {Todo}      = require('./models/todo');
var {User}      = require('./models/user');
var {ObjectID}  = require('mongodb');

var app         = express();

//const port      = process.env.PORT || 3000;

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
    if ( ! ObjectID.isValid(id) ){
       return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.send({todo: todo});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.delete('/todos/:id', (req, res) => {
    if ( ! ObjectID.isValid(req.params.id) ){
        return res.status(404).send();
     }

     Todo.findByIdAndRemove(req.params.id).then( (todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.send({todo: todo});
     }, (e) => {
        res.status(400).send(e);
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    //the _.pick will receive a object and pick just the attibutes specified
    var body = _.pick(req.body, ['text', 'completed']);
    
    if ( ! ObjectID.isValid(id) ){
        return res.status(404).send();
    }

    if ( _.isBoolean(body.completed) && body.completed ){
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
        body.completed = false;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( (todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.send({todo: todo});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    var user = new User({
        email: body.email,
        password: body.password
    });

    user.save().then( () => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });

});

app.get('/users', (req, res) => {
    
    User.find().then((users) => {
        res.send({users});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.listen(process.env.PORT, () => {
    console.log(`Started on port ${process.env.PORT}`);
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