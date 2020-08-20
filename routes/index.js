var express = require('express');
var router = express.Router();
const argon2 = require('argon2');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('93800279261-gth1fq4j4ukij0ecbrr0j1htrqpjjl0d.apps.googleusercontent.com');
var sanitizeHtml = require('sanitize-html');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
	//Connect to the database
	req.pool.getConnection(async function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var hash = null;
		try {
			// Hash and salt password
			hash = await argon2.hash(req.body.password, {type: argon2.argon2id});
		} catch (err) {
			console.log(err);
			res.sendStatus(422);
			return;
		}


		var email = req.body.email;
		// Check if email contains unpermiited characters
		email = sanitizeHtml(req.body.email);
		if (email != req.body.email) {
			res.sendStatus(400); // Respond with 400 if it does
		} else {
			email = email.toLowerCase(); // Otherwise convert email to all lowercase
		}

		// Enter user information into the database
		var query = "INSERT INTO user SET first_name = ?, last_name = ?, email = ?, password_hash = ?, is_manager = ?;";
		connection.query(query, [sanitizeHtml(req.body.firstName), sanitizeHtml(req.body.lastName), email, hash, req.body.manager], function(err, rows, fields) {
			if (err) {
				// Do not allow duplicate emails
				if (err.code === 'ER_DUP_ENTRY') { // If email already exists
					res.sendStatus(409); // Return conflict error code
					return;
				} else { // For all other errors
					res.sendStatus(500);
					console.log(err);
					return;
				}
			}

			// If registration successful, create user session
			var query = "SELECT user_id, first_name, last_name, email, avatar, is_manager FROM user WHERE email = ? AND password_hash = ?";
			connection.query(query, [req.body.email, hash], function(err, user, fields) {
				connection.release(); // release connection
				if (err) {
					res.sendStatus(500);
					console.log(err);
					return;
				}
				// Create user session
				console.log("Creating user session");
				req.session.userData = user[0];
				req.session.user_id = user[0].user_id;
				console.log(req.session.userData);
				res.end();
			});
		});
	});
});

router.post('/login', function(req, res, next) {
	var email = req.body.email.toLowerCase();
	var password = req.body.password;

	//Connect to the database
	req.pool.getConnection(async function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var query = "SELECT user_id, first_name, last_name, email, avatar, password_hash, is_manager FROM user WHERE email = ?";
		connection.query(query, [email], async function(err, user, fields) {
			connection.release(); // release connection
			if (err || user.length <= 0) {
				// No valid user found
				res.sendStatus(401);
				console.log(err);
				return;
			}

			// Send 401 if user signed up with openID
			if (user[0].password_hash === null) {
				res.sendStatus(401);
				return;
			}

			// Verify password
			if (await argon2.verify(user[0].password_hash, password)) {
				// Password matches, create user session
				console.log("Creating user session");
				req.session.userData = user[0];
				delete req.session.userData.password_hash;
				console.log(req.session.userData);
				req.session.user_id = user[0].user_id;
				res.end();
			} else {
				res.sendStatus(401);
			}

		});
	});

});

router.post('/googlelogin', function(req, res, next) {
	var token = req.body.token;

	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: '93800279261-gth1fq4j4ukij0ecbrr0j1htrqpjjl0d.apps.googleusercontent.com'
		});
		const payload = ticket.getPayload();
		const email = payload['email'];

		req.pool.getConnection(async function(err,connection) {
			if (err) {
				console.log("error1");
				res.sendStatus(500);
				return;
			}

			// Check if email exists against database
			var query = "SELECT user_id, first_name, last_name, email, avatar, google_login, is_manager FROM user WHERE email = ? OR google_email = ?";
			connection.query(query, [email, email], async function(err, user, fields) {
				if (err) {
					console.log("error2");
					res.sendStatus(500);
					console.log(err);
					return;
				}

				// If user exists
				if (user.length > 0) {

					// Make sure google login is reflected on user's profile
					if (user[0].google_login == false) {
						var query = "UPDATE user SET google_email = ?, google_login = true WHERE user_id = ?;";
						connection.query(query, [email, user[0].user_id], function(err, rows, fields) {
							connection.release(); // release connection
							if (err) {
								console.log("error 3");
								console.log(err);
								res.sendStatus(500);
								return;
							}
						});
					}
					// Create user session
					console.log("Creating user session");
					req.session.userData = user[0];
					delete req.session.userData.google_login;
					console.log(req.session.userData);
					req.session.user_id = user[0].user_id;
					res.end();
				} else {
					// If user not exists, create a new account
					var firstName = payload['given_name'];
					var lastName = payload['family_name'];

					// Enter user information into the database
					query = "INSERT INTO user SET first_name = ?, last_name = ?, email = ?, google_email = ?, google_login = true, only_open_id = true";
					connection.query(query, [firstName, lastName, email, email], function(err, rows, fields) {
						if (err) {
							console.log("error4");
							res.sendStatus(500);
							console.log(err);
							return;
						}
						// If registration successful, create user session
						var query = "SELECT user_id, first_name, last_name, email, avatar, FROM user WHERE email = ?";
						connection.query(query, [email], function(err, user, fields) {
							if (err) {
								console.log("error5");
								res.sendStatus(500);
								console.log(err);
								return;
							}
							// Create user session
							console.log("Creating user session");
							req.session.userData = user[0];
							req.session.user_id = user[0].user_id;
							console.log(req.session.userData);
							res.sendStatus(404); // Return 404 user did not exist so client can redirect accordingly
							connection.release(); // release connection
						});
					});
				}

			});
		});

	}
	verify().catch(console.error);

});

module.exports = router;
