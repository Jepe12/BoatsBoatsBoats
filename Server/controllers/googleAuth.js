const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config()


passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback", // After retriving info from google --> Info will be sent to this route
    passReqToCallback   : true
  },

  function(request, accessToken, refreshToken, profile, done) { 
    
    console.log(profile)
    
    User.findOrCreate({ googleId: profile.id }, function (err, user) { 
    return done(err,profile);
    
    }); 
  }
));

passport.serializeUser((user,done) => {
    done(null,user)
});

passport.deserializeUser((user,done) => {
    done(null,user)
});


// By this point, user has successfully logged in
  // This function should: 
  // - Check if user has an account in the DB
  // - If not -> Register them and log them in
  // - If they do have an account -> Log them in