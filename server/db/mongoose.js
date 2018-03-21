var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://vini:pass@ds061721.mlab.com:61721/todos');
console.log("URL HERE");
 console.log(process.env.DATABASE_URL);
mongoose.connect( process.env.DATABASE_URL);
// || 'mongodb://localhost:27017/TodoApp'
module.exports = {mongoose};