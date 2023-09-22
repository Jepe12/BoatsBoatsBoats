const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const ProductController = require('../controllers/product');
require('dotenv').config();

// Configure Passport.js with Google OAuth2 Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/google/callback",
  passReqToCallback: true
}, async function (request, accessToken, refreshToken, profile, done) {
  try {
    // This is where you can perform custom actions if needed
    // For now, simply return the profile to indicate success
    return done(null, profile);
  } catch (error) {
    done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
