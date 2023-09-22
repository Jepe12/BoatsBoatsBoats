var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var credentials = require('./middleware/credentials');
var mongoose = require('mongoose'); // Import mongoose
var expressHandlebars = require('express-handlebars');
const session = require('express-session'); // Session
const passport = require('passport'); // Passport for OAuth2

var viewRouter = require('./routes/view');
var indexRouter = require('./routes/index');

var app = express();

// Configure session middleware
app.use(session({
  secret: 'your-secret-key', // Replace with a better key? 
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Handle the options credentials check - Before any potential CORS & fetch cookies credential requirement 
app.use(credentials);

var MongoStuff = require('mongodb-memory-server');

// This will create an new instance of "MongoMemoryServer" and automatically start it
//var mongod;

var mongoURI = "mongodb+srv://Restful_Knights:hS7jb2tVdrN3RBfz@nwen304cluster.snhsycw.mongodb.net/?retryWrites=true&w=majority"

//MongoStuff.MongoMemoryServer.create().then((v) => { 
  //mongod = v;
  //console.log('mongodb started')
//});
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.locals.dburi = mongoURI;
  next();
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const hbs = expressHandlebars.create({
  helpers: {
    eq: (arg1, arg2, options) => {
      return (arg1 == arg2);
    },
    gt: (arg1, arg2, options) => {
      return (arg1 > arg2);
    },
    cartPrice: (arg1, arg2, options) => {
      return (arg1 * arg2).toFixed(2);
    },
    empty: (arg1, arg2, options) => {
      return arg1.length == 0;
    },
    notEmpty: (arg1, arg2, options) => {
      return arg1.length != 0;
    },
    toLocaleDateString: (arg1, arg2, options) => {
      return arg1.toLocaleDateString();
    },
    not: (arg1, arg2, options) => {
      return !arg1;
    }
  }
});

//Use a Custom Templating Engine
app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve("./views"));

app.use('/', viewRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err })
});

module.exports = app;
