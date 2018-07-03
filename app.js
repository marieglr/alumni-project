require('dotenv').config();

const favicon      = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const express      = require('express');
const hbs          = require('hbs');
const path         = require('path');
const logger       = require('morgan');
const mongoose     = require('mongoose');
const flash        = require('connect-flash');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);

const passportSetup = require('./passport/setup.js');

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/alumni-project', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

hbs.registerPartials(__dirname+ '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(session({
  secret: process.env.sessionSecret,
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));

app.use(flash());

passportSetup(app);

// default value for title local
app.locals.title = 'Ironhack Alumnis - Project 2 by Meri and Marie';



const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth-router.js');
app.use('/', authRouter);

const alumRouter = require('./routes/alum-router.js');
app.use('/', alumRouter);

module.exports = app;
