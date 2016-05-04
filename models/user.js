// Load required packages
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// Define our user schema
var UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: {type: String, lowercase: true, unique: true},
    email: {type: String, unique: true, required: true},
    hashPass: String,
    salt: String
    // password: String,
    classes: [String],
    dateCreated: Date
});

UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('base64');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');

  return this.hash === hash;
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
