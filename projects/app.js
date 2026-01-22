const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');

mongoose.connect("mongodb://127.0.0.1:27017/projectsdb")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error(err));


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');       
const projectsRouter = require('./routes/projects');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'tajna123',
  resave: false,
  saveUninitialized: false
}));


app.use('/', indexRouter);
app.use('/auth', authRouter);        
app.use('/projects', projectsRouter);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
