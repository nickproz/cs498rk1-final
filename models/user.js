// Load required packages
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// Define our user schema
var UserSchema = mongoose.Schema({
    firstName: {
      type: String,
      required: [true, 'A first name is required!']
    },
    lastName: {
      type: String,
      required: [true, 'A last name is required!']
    },
    userName: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'A username is required!']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'An email is required!']
    },
    hashPass: String,
    salt: String,
    classes: [String],
    dateCreated: Date
});

UserSchema.methods.generateJWT = function() {
  // set expiration to 30 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 30);

  return jwt.sign({
    _id: this._id,
    userName: this.userName,
    exp: parseInt(exp.getTime() / 1000),
  }, process.env.JWT_SECRET);
};

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('base64');
  this.hashPass = crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  return this.hashPass === hash;
};

UserSchema.pre('save', function(next) {
  if (!this.dateCreated) {
    this.dateCreated = new Date();
  }
  next();
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
