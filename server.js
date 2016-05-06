process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Requiring dependencies
var mongoose = require('mongoose');

// Configure Mongoose
var db = mongoose.connect('mongodb://localhost/mean-passport');

require('goodgoodstudy-server')({
    uploadPath: __dirname + '/uploads',
    port: 12345,
    mongoose: mongoose,
    dbconn: db
});

// Configure Express
var express = require('./config/express');
var app = express();

var frontendPort = process.env.FRONTENDPORT || 3000;
var port = process.env.PORT || 4000;

// Bootstrap passport config
var passport = require('./config/passport')();

/Allow CORS so that backend and frontend can be put on different servers
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
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

// All our routes will start with /api
app.use('/api', router);

// Bootstrap application
app.listen(3000);

// Tell developer about it
console.log('Server running at http://localhost:3000/');