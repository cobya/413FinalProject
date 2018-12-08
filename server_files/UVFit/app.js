var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Create the app
var app = express();

// Require the routers to be used
var dataRouter = require('./routes/uvfitdata');
var uvFitRouter = require('./routes/uvfit');
var usersRouter = require('./routes/users');
var activityRouter = require('./routes/activity');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Enable the use of some nice things
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use the specified routes
app.use('/uvfitdata', dataRouter);
app.use('/uvfit', uvFitRouter);
app.use('/users', usersRouter);
app.use('/activity', activityRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
