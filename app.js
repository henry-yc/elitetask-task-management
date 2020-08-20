var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// bcrypt for generating session secret
const bcrypt = require('bcrypt');

// Use sessions
var session = require('express-session');

// use mysql in this app
var mysql = require('mysql');

// Use mySQL session store
var MySQLStore = require('express-mysql-session')(session);

// Use compression
var compression = require('compression');

// create a 'pool' (group) of connections to be used for connecting with our SQL server
var dbConnectionPool = mysql.createPool({
	host: 'localhost',
	database: 'elitetask'
});

var sessionStore = new MySQLStore({}, dbConnectionPool);

var app = express();

// Compress all responses
app.use(compression());

// Middleware for accessing the database
app.use(function(req, res, next) {
	req.pool = dbConnectionPool;
	next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Generate session secret
var salt1 = bcrypt.genSaltSync();
var salt2 = bcrypt.genSaltSync();
var secret = bcrypt.hashSync(salt1 + salt2, 10);

app.use(session({
	secret: secret,
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false, sameSite: 'lax' }
}));

// Restrict access to static pages that require authorisation, redirect user to home page if not logged in
app.get(['/task_page.html', '/post_registration.html', '/profile.html'], function(req, res,  next) {
	if (!('userData' in req.session)) {
		res.redirect('/');
	} else {
		next();
	}
});

// If accessing hompage/signup and user is logged in, redirect user to task page
app.get(['/', '/index.html', '/signup.html'], function(req, res,  next) {
	if ('userData' in req.session) {
		res.redirect('/task_page.html');
	} else {
		next();
	}
});

// Clear session store on server shutdown
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
	process.on('SIGINT', function() {
		dbConnectionPool.getConnection(function(err,connection) {
			if (err) {
				console.log(err);
				process.exit();
			}
			var query = "DELETE FROM sessions";
			connection.query(query, function(err, rows, fields) {
				connection.release();
				if (err) {
					console.log(err);
					process.exit();
				}
				console.log("Shutting down...");
				process.exit();
			});
		});

	});
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
