var passport = require('passport'),
    User = require('mongoose').model('User');

module.exports = function() {
    // Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize sessions
    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, '-password -salt', function(err, user) {
            done(err, user);
        });
    });


var LocalStrategy = require('passport-local').Strategy;
module.exports = function() {
    // Use local strategy
    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne({
            username: username
        }, function(err, user) {
            // When an error occurred
            if (err) {
                return done(err);
            }

            // When user not found
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user'
                });
            }

            // When the password is invalid
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }

            return done(null, user);
        });
    }));
};