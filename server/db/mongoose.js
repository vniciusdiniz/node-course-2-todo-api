var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://vini:pass@ds061721.mlab.com:61721/todos');
//mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};