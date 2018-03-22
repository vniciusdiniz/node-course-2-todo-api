const env       = process.env.NODE_ENV || 'development';
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.DATABASE_URL = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.DATABASE_URL = 'mongodb://localhost:27017/TodoAppTest';
} else {
    //it will be the default set by heroku as 'production'
}