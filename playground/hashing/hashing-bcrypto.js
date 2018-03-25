const bcrypt   = require ('bcryptjs');

var password = '123abc';

//1 generate salt password
bcrypt.genSalt(10, (err, salt) => {
    //2 hash the password
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$vcZB2d.ys55pRNrJCFtGfOqFFg6AjTeNFcPZ7hAQ35Nv1nhzy6jrC';

//comapre with are equals.. res will be true or false
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

