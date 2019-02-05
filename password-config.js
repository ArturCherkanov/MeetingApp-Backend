const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./user');
const bcrypt = require('bcrypt');

    opts = {};


opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         User.findOne({ username: username }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) {
//                 return done(null, false, { message: 'Incorrect username.' });
//             }
//             bcrypt.compare(password, user.password, function (err, res) {
//                 if (err) return done(null, false, { message: 'Incorrect password.' });
//                 if (res === false) {
//                     return done(null, false, { message: 'Incorrect password.' });
//                 }
//                 return done(null, user);
//             });

//         });
//     }
// ));