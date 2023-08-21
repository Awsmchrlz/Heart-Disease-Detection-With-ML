const LocalStrategy = require('passport-local').Strategy;
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');


module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'emailAddress' }, (emailAddress, password, done) => {
      // Find user
      console.log(emailAddress)
      User.findOne({emailAddress:emailAddress })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'unregistered email' });
          }
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'password incorrect' });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  
  passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});

};
