// const MongoClient       = require('mongodb').MongoClient;
const {MongoClient, ObjectID}       = require('mongodb');

//it is possible to incorporate objectId to any place you want

// var obj = new ObjectID();
// console.log(obj);

//ES6 destruction
//a way to make new variables from object properties

// var user = {name: 'Vinicius', age: 28};
// var {name} = user;
// console.log(name);


//no need to create the database first, just choose a name (TodoApp)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        //the return here is to stop the function to run
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db("TodoApp");

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err){
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //Insert
    // db.collection('Users').insertOne({
    //     //_id: 123,
    //     name: 'Vinicius',
    //     age: 28,
    //     location: "3181 VIC"
    // }, (err, result) => {
    //     if (err){
    //         return console.log('Unable to insert user', err);
    //     }
    //    // console.log(JSON.stringify(result.ops, undefined, 2));
    //    console.log(result.ops[0]._id.getTimestamp());
    // });

    //find
    // db.collection('Todos').find({
    //         _id: new ObjectID('5ab04f2c64843730a0b84068')
    // }).toArray().then((docs) => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log('Unable to fetch docs', err);
    // });

    //count
    // db.collection('Todos').find().count().then((count) => {
    //         console.log(`Todos count: ${count}`);
    //     }, (err) => {
    //         console.log('Unable to fetch docs', err);
    // });

    db.collection('Users').find({
        name: "Vinicius"
    }).count().then((count) => {
        console.log(`Vinicius count: ${count}`);
    }, (err) => {
        console.log('Unable to fetch Vinicius', err);
    });

   // client.close();
});