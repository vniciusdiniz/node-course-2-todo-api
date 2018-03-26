const expect    = require('chai').expect;
const request   = require('supertest');
// const jwt       = require('jsonwebtoken');
const ObjectID  = require('mongodb').ObjectID;

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

    it ('should create a new todo', function(done) {
        this.timeout(5000);
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text : text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).to.equal(text);
            })
            .end( 
                function (err, res) {
                if (err){
                    done(err);
                } else {
                    Todo.find({text}).then((todos) => {
                        expect(todos.length).to.equal(1);
                        expect(todos[0].text).to.equal(text);
                        done();
                    }).catch((e) => {
                        done(e);
                    });
               }
            }
        );
    });

    it ('should not create todo with invalid body data', (done) => {
        var text = '';

        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .end((err, res) => {
                if (err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).to.equal(2);
                    done();
                }).catch((e) => done(e));
            })
    });


});

describe('GET /todos', () => {

    it ('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).to.equal(2);
            })
            .end(done);
    });

});

describe('GET /todos/:id', () => {

    it ('should create todo doc ', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).to.equal(todos[0].text);                
            })
            .end(done);
    });

    it ('should return 404 if todo not found', (done) =>{
        var id = new ObjectID().toHexString;
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it ('should return 404 for non object ids', (done) =>{
        var id = 123;
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

});

describe('DELETE /todos/:id', () => {

    it ('should remove a todo ', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).to.equal(todos[0].text);                
            })
            .end( (err, res) => {
                if (err) { return done(err) }
                
                Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                    expect(todo).to.not.exist;
                    done();
                }).catch((e) => done(e));
            });
    });

    it ('should return 404 if todo not found', (done) =>{
        var id = new ObjectID().toHexString;
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it ('should return 404 if object id is invalid', (done) =>{
        var id = 123;
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

});

describe ('PATCH /todos/:id', () => {

    it('should update a todo', (done) => {
        var text = 'Updated text todo';
        
        request(app)
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .send({
            text,
            completed: true
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).to.equal(text);
            expect(res.body.todo.completed).to.equal(true);
            expect(res.body.todo.completedAt).to.be.a('number');
        })
        .end((err, res) => {
            if (err) { return done(err) }
                
            Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                expect(todo.text).to.equal(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var text = 'Updated text todo!!!!!!!!!!!!';
        
        request(app)
        .patch(`/todos/${todos[1]._id.toHexString()}`)
        .send({
            text,
            completed: false
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).to.equal(text);
            expect(res.body.todo.completed).to.equal(false);
            expect(res.body.todo.completedAt).to.be.a('null');
        })
        .end((err, res) => {
            if (err) { return done(err) }
                
            Todo.findById(todos[1]._id.toHexString()).then((todo) => {
                expect(todo.text).to.equal(text);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe ('GET /users/me', () => {
    it ('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            //set the header (header name, header value)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).to.equal(users[0]._id.toHexString());
                expect(res.body.email).to.equal(users[0].email);
            })
            .end(done);
    });

    it ('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).to.deep.equal({});
            })
            .end(done);
    });

});

describe ('POST /users', () => {
    it ('should create a user', (done) => {

        var email = 'example@example.com';
        var password = 'examplePass';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).to.exist;
                expect(res.body._id).to.exist;
                expect(res.body.email).to.equal(email);
            })
            .end( (err, res) => {
                if (err){
                    done(err);
                } else {
                    User.findOne({email}).then( (userFound) => {
                        expect(userFound).to.exist;
                        expect(userFound.password).to.not.equal(password);
                        done();
                    }).catch((e) => done(e));
                }
            });
    });

    it('should return validation errors if request invalid', (done) => {

        var email = 'examp';
        var password = 'examp';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it ('should not create user if email in use', (done) => {

        var email = users[0].email;
        var password = 'examplePass';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).to.exist;
            })
            .end((err, res) => {
                if (err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).to.include({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e) );
            });
    });

    it('should reject invalid login', (done) => {
        
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'wrongPass'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).to.not.exist;
            })
            .end((err, res) => {
                if (err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).to.equal(0);
                    done();
                }).catch((e) => done(e) );
            });
    });
});

describe ('DELETE /users/me/token', () => {
    it ('should remove auth token and logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end( (err, res) => {
                if (err){
                    return done(err);
                }
                User.findById(users[0]._id).then( (user) => {
                    expect (user.tokens.length).to.equal(0);
                    done();
                }).catch((e) => done(e) );
            });
    });
});


    // console.log("DEBUGGING");
    // console.log("========================================");
    // console.log( );
    // console.log("========================================");
    // console.log("DEBUGGING");