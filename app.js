// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var router = express.Router();


var User = require('./models/user');
var Class = require('./models/class');

// Connect to our MLab database
mongoose.connect('mongodb://nickproz:bearsrock@ds033897.mlab.com:33897/cs498rk1-final');
var db = mongoose.connection;

require('goodgoodstudy-server')({
    uploadPath: __dirname + '/uploads',
    port: 12345,
    mongoose: mongoose,
    dbconn: db
});

// Create our Express application
var app = express();

// Use environment defined port or 4000
var frontendPort = process.env.FRONTENDPORT || 3000;
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend can be put on different servers
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

    // Intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Allow req to access our database
app.use(function(req,res,next){
    req.db = db;
    next();
});

// Configure passport
passport.use(new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
}, function(payload, done) {
    User.findById(payload._id, function(err, user) {
        if (err) {
            return done(err, false, {message: 'Error from DB while finding user by _id in JWT!'});
        } else if (user) {
            return done(null, user);
        }
        done(null, false, {message: 'User not found with _id in JWT!'});
    });
}));
app.use(passport.initialize());

function JWTAuthMiddleware(req, res, next) {
    passport.authenticate('jwt', {session: false}, function(err, user, info) {
        if (err) return next(err);
        if (user)
            req.user = user;
        else
            req.user = false;
        return next();
    })(req, res, next);
}

// All our routes will start with /api
app.use('/api', JWTAuthMiddleware, router);

function onlyAllowLoggedInUsers(req, res, next) {
    if (!req.user)
        return res.status(401).json({code: -1, message: "You're not logged in!", data: []});
    return next();
}

// Default route
var homeRoute = router.route('/');

// Hello World!
homeRoute.get(function(req, res) {
  res.json({ loggedInUser: req.user });
});

// Authentication
var loginRoute = router.route('/login');
loginRoute.post(function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email: email}, function(err, data) {
        if (err)
            return res.status(500).json({code: -1, message: "Something went wrong! validate your input please", data: err});
        if (!data)
            return res.status(400).json({code: -1, message: "The email supplied does not exist!", data: err});
        if (data.validPassword(password))
            return res.json({token: data.generateJWT()});
        return res.status(400).json({code: -1, message: "The credentials supplied do not match!", data: err});
    });
});

// User routes
var usersRoute = router.route('/users');

usersRoute.post(function(req, res) {
    if (req.user)
        return res.status(400).json({code: -1, message: "You're already logged in!", data: []});

    var user = new User();
    var data = req.body;

    // Initialize variables based on data passed in
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.userName = data.userName;
    user.email = data.email;

    if (!data.password || data.password.length < 6)
        return res.status(500).json({message: 'Please enter a valid password with at least 6 characters!', data: []});

    user.setPassword(data.password);

    // Try to find a user with specified email, if there is no user with specified email, save user to database
    User.findOne({ 'email': user.email }, function (err, person) {
        if (err) {
            return res.status(500).send({ 'message': 'Please fill out all fields with valid characters.', 'data': err });
        }
        if (person === null) {
            user.save(function(err) {
                if (err)
                    return res.status(500).send({ 'message': 'The username provided is already in use!', 'data': err });
                else
                    return res.json({token: user.generateJWT()});
            });
        }
        else
            return res.status(500).send({ 'message': 'The email provided is already in use!', 'data': []});
    });
});

// Get all users
usersRoute.get(function(req, res) {

    // Get all query parameters
    var where = eval("("+req.query.where+")");
    var sort = eval("("+req.query.sort+")");
    var select = eval("("+req.query.select+")");
    var skip = eval("("+req.query.skip+")");
    var limit = eval("("+req.query.limit+")");
    var count = eval("("+req.query.count+")");

    // Return count of users that would be returned that meet the specified criteria
    if(count === true) {
        User.count(where, function(err, list) {
            if (err)
                return res.status(500).send({'message': 'Failed to retrieve users.', 'data': []});
            else
                return res.status(200).send({'message': "OK", 'data': list});
        }).limit(limit).skip(skip).sort(sort);
    }
    // Return all users that meet the specified criteria
    else {
        User.find(where, select, function(err, list) {
            if (err)
                return res.status(500).send({'message': 'Failed to retrieve users.', 'data': []});
            else
                return res.status(200).send({'message': "OK", 'data': list});
        }).limit(limit).skip(skip).sort(sort);
    }
});

var userDetailsRoute = router.route('/users/:id');

// Get a single user
userDetailsRoute.get(function(req, res) {

    var id = req.params.id;

    // Find user based on specified id, return 404 or user found
    User.findOne({'_id': id }, function(err, person) {
        if (err || person === null)
            return res.status(404).send({'message': 'User not found.', 'data': []});
        else
            return res.status(200).send({'message': "OK", 'data': person});
    });
});


// Update a user
userDetailsRoute.put(onlyAllowLoggedInUsers, function(req, res) {

    var id = req.params.id;
    var user = req.body;
	console.log(user);
	
    // if(user.firstName === "undefined" || user.lastName === "undefined" || user.username === "undefined" || user.email === "undefined" || user.password === "undefined" || user.firstName === undefined || user.lastName === undefined || user.username === undefined || user.email === undefined || user.password === undefined) {
    //     return res.status(500).send({ 'message': 'Please fill out all fields with valid characters.', 'data': [] });
    // }
    ['firstName', 'lastName', 'userName', 'email'].forEach(function(attr) {
        if (!user[attr] || user[attr] === 'undefined')
            return res.status(500).send({message: 'Please put with all the required fields!'});
    });

    // Use Passport method to set a secure password.
    //User.setPassword(user.password)

    User.update(
        { '_id': id },
        { $set: {"firstName": user.firstName, "lastName": user.lastName, "userName": user.userName, "email": user.email, 'classes': user.classes} },

        function(err, person) {
            if(err)
                return res.status(400).send({ 'message': 'User not found.', 'data': [] });
            else {
                User.findOne({'_id': id }, function(err, person) {
                    if (err || person === null)
                        return res.status(404).send({'message': 'User not found.', 'data': []});
                    else
                        return res.status(200).send({'message': "User succesfully updated!", 'data': person});
                });
            }
        }
    );
});

// Remove a user
userDetailsRoute.delete(onlyAllowLoggedInUsers, function(req, res) {

    var id = req.params.id;

    // Find user based on specified id, return 404 or remove user from database
    User.findOne({'_id': id }, function(err, person) {
        if (err || person === null)
            return res.status(404).send({'message': 'User not found.', 'data': []});
        else {
            var tasks = person.pendingTasks;
            User.remove({ '_id' : id }, function(err) {
                if(err)
                    return res.status(404).send({'message': 'User not found.', 'data': []});
                else
                    return res.status(200).send({'message': 'User successfully deleted.', 'data': []});
            });
        }
    });
});

// Create a new class
var classesRoute = router.route('/classes');

classesRoute.post(onlyAllowLoggedInUsers, function(req, res) {

    var newClass = new Class();
    var data = req.body;

    // Initialize variables based on data passed in
    newClass.id = data.id;
    newClass.identifier = data.identifier;
    newClass.department_id = data.department_id;
    newClass.name = data.name;
    newClass.credit = data.credit;
    newClass.description = data.description;
    newClass.users = [];
    newClass.dateCreated = new Date();

    // Try to find a user with specified email, if there is no user with specified email, save user to database
    Class.findOne({ 'id': newClass.id }, function (err, oldClass) {
        if (err) {
            return res.status(500).send({ 'message': 'Failed to save class to the database.', 'data': [] });
        }
        if (oldClass === null) {
            newClass.save(function(err) {
                if (err)
                    return res.status(500).send({ 'message': 'Failed to save class to the database.', 'data': [] });
                else
                    return res.status(201).send({ 'message': 'Class successfully created!', 'data': newClass });
            });
        }
        else
            return res.status(500).send({ 'message': 'The class provided is already in the database!', 'data': []});
    });
});

// Get all classes
classesRoute.get(function(req, res) {

    // Get all query parameters
    var where = eval("("+req.query.where+")");
    var sort = eval("("+req.query.sort+")");
    var select = eval("("+req.query.select+")");
    var skip = eval("("+req.query.skip+")");
    var limit = eval("("+req.query.limit+")");
    var count = eval("("+req.query.count+")");

    // Return count of users that would be returned that meet the specified criteria
    if(count === true) {
        Class.count(where, function(err, list) {
            if (err)
                return res.status(500).send({'message': 'Failed to retrieve classes.', 'data': []});
            else
                return res.status(200).send({'message': "OK", 'data': list});
        }).limit(limit).skip(skip).sort(sort);
    }
    // Return all users that meet the specified criteria
    else {
        Class.find(where, select, function(err, list) {
            if (err)
                return res.status(500).send({'message': 'Failed to retrieve classes.', 'data': []});
            else
                return res.status(200).send({'message': "OK", 'data': list});
        }).limit(limit).skip(skip).sort(sort);
    }
});

var classDetailsRoute = router.route('/classes/:id');

// Get a single class
classDetailsRoute.get(function(req, res) {

    var id = req.params.id;

    // Find user based on specified id, return 404 or user found
    Class.findOne({'id': id }, function(err, person) {
        if (err || person === null)
            return res.status(404).send({'message': 'Class not found.', 'data': []});
        else
            return res.status(200).send({'message': "OK", 'data': person});
    });
});

// Update a class
classDetailsRoute.put(onlyAllowLoggedInUsers, function(req, res) {

    var id = req.params.id;
    var data = req.body;

    Class.update(
        { 'id': id },
        { $set: {"id": data.id, "department_id": data.department_id, "name": data.name, "credit": data.credit, "description": data.description, "users": data.users} },
        function(err, updatedClass) {
            if(err)
                return res.status(400).send({ 'message': 'Class not found.', 'data':[] });
            else
                return res.status(200).send({'message': "Class succesfully updated!", 'data': data});
        }
    );
});

// Remove a class
classDetailsRoute.delete(onlyAllowLoggedInUsers, function(req, res) {

    var id = req.params.id;

    // Find user based on specified id, return 404 or remove user from database
    Class.findOne({'id': id }, function(err, newClass) {
        if (err || newClass === null)
            return res.status(404).send({'message': 'Class not found.', 'data': []});
        else {
            Class.remove({ 'id' : id }, function(err) {
                if(err)
                    return res.status(404).send({'message': 'Class not found.', 'data': []});
                else
                    return res.status(200).send({'message': 'Class successfully deleted.', 'data': []});
            });
        }
    });
});



// Start the server
app.listen(port);
console.log('Server running on port ' + port);


var frontend = express();
frontend.use(express.static(__dirname + '/public'));
frontend.listen(frontendPort);
console.log('Front-end running on port ' + frontendPort);
