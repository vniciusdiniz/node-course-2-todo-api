const ObjectID  = require('mongodb').ObjectID;
const jwt       = require('jsonwebtoken');

const {Todo}    = require('./../../models/todo');
const {User}    = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'vini@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'gabi@example.com',
    password: 'userTwoPass'
}];

const populateUsers = function(done){
    this.timeout(5000);
    User.remove({}).then( () => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        
        //take an array of Promisses and run them all
        Promise.all([userOne, userTwo]).then(() => {
            done();
        });
    });
};

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
        done();
    });
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}