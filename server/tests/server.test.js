const expect    = require('chai').expect;
const request   = require('supertest');
const ObjectID  = require('mongodb').ObjectID;

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
        done();
    });
});

describe('POST /todos', () => {

    it ('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).to.equal(text);
            })
            .end((err, res) => {
                if (err){
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).to.equal(1);
                    expect(todos[0].text).to.equal(text);
                    done();
                }).catch((e) => done(e));
            })
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
















    // console.log("DEBUGGING");
    // console.log("========================================");
    // console.log( );
    // console.log("========================================");
    // console.log("DEBUGGING");