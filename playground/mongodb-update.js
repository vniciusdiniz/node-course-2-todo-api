const {MongoClient, ObjectID}       = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db("TodoApp");

    // db.collection('Todos').findOneAndUpdate({
    //      text: "Walk the dog"
    // }, {
    //     $set : {
    //         completed: true
    //     }
    // }, {
    //     //by default, returnOriginal is true, returning the original instead of the updated
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(`The toDo ${result.value.text} was updated`);
    // });

    // db.collection('Users').findOneAndUpdate({
    //     name: "Sarah"
    // }, {
    //     $set : {
    //         name: "Vinicius"
    //     },
    //         $inc : {
    //             age: 1
    //         }
    // }, {
    //     //by default, returnOriginal is true, returning the original instead of the updated
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result.value);
    // });

    // client.close();
});