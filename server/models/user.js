const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');

//how many rounds or iterations the key setup phase uses
SALT_WORK_FACTOR = 10;

var userObject  = {
    email: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        trim: true, //remove empty spaces
        //mongoose validation
        validate: {
            validator: (value) => {
                validator.isEmail(value)
            },
            message: '{VALUE} is not a valid email.'     
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true            
        },
        token:{
            type: String,
            required: true
        }
    }]
};

//add the UserSchema
//and passing UserSchema as second arg of mongoose.model, instead of userObject,
//allowing to add our own methods to the User
var UserSchema  = new mongoose.Schema(userObject);

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);

};

UserSchema.methods.generateAuthToken = function () {
    var user    = this;
    var access  = 'auth';
    var token   = jwt.sign( { _id: user._id.toHexString(), access }, 
                    process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat({
        access, token
    });

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function(token){
    var user = this;
    // $pull is a mongo operator
    // that remove itens from an array that match certain criteria
    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    });
};

//statis: method of the model, methods: method of the instance
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e){
        //doing this, the then() function callback
        // will not be fired
        return new Promise((resolve, reject) => {
            reject();
        });
        //return Promise.reject('test');
    }
    
    return User.findOne ({
        _id: decoded._id,
        //quotes are required when there is a dot in a value
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
  
    return User.findOne({email}).then((user) => {
      if (!user) {
        return Promise.reject();
      }
  
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
};

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if ( user.isModified('password') ){
        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema /*userObject*/);

module.exports = {User};