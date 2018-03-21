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
    text: 'Second test todo'
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

    // console.log("DEBUGGING");
    // console.log("========================================");
    // console.log(todos[0]._id.toHexString());
    // console.log("========================================");
    // console.log("DEBUGGING");

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