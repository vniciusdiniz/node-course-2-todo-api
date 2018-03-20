const {MongoClient, ObjectID}       = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db("TodoApp");

    // db.collection('Todos').deleteMany({
    //     text: "Eat lunch"
    // }).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({
    //     text: "Eat lunch"
    // }).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete returns the object deleted
    // db.collection('Users').findOneAndDelete({
    //     _id: new ObjectID("5ab0596d049a693d385863b8")
    // }).then((result) => {
    //     console.log(`The user ${result.value.name} was deleted`);
    // });

   // client.close();
});