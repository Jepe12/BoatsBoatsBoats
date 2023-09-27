const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();

// Configure Passport.js with Google OAuth2 Strat
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.HOSTED_URL +"/google/callback",
  passReqToCallback: true
}, async function (request, accessToken, refreshToken, profile, done) {
  try {
    return done(null, profile);
  } catch (error) {
    return done(error); 
  }
}));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
