//library imports
const _             = require('lodash');
const express       = require('express');
const bodyParser    = require('body-parser');
var {ObjectID}      = require('mongodb');

//local imports
require('./config/config.js');
var {mongoose}      = require('./db/mongoose');
var {Todo}          = require('./models/todo');
var {User}          = require('./models/user');
var {authenticate}  = require('./middleware/authenticate');

var app         = express();

//const port      = process.env.PORT || 3000;

//middleware
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    
    Todo.find({_creator: req.user._id}).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if ( ! ObjectID.isValid(id) ){
       return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.send({todo: todo});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.delete('/todos/:id', authenticate, (req, res) => {
    if ( ! ObjectID.isValid(req.params.id) ){
        return res.status(404).send();
     }

     Todo.findOneAndRemove({ 
         _id: req.params.id,
         _creator: req.user._id
    }).then( (todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.send({todo: todo});
     }, (e) => {
        res.status(400).send(e);
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id, 
        _creator: req.user._id
    }, {$set: body}, {new: true})
    .then( (todo) => {
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

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
  
    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
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