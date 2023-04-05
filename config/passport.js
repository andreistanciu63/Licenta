const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//LOAD USER MODEL

const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        //Match User
        User.findOne({
            email: email
        }).then(user => {
            if(!user){
                return done(null, false, {message: 'No user found'});
            }  
            
            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                return done(null, false, {message: 'Password Incorrect' });
                }
            })
        })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id); 
      });
    
      passport.deserializeUser(async function(id, done) {
        const user = await User.findById(id);
        done(null, user);
      });
}