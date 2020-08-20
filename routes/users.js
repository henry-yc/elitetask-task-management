var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'public/images/uploads'});
const argon2 = require('argon2');
var sanitizeHtml = require('sanitize-html');
var fs = require('fs');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('93800279261-gth1fq4j4ukij0ecbrr0j1htrqpjjl0d.apps.googleusercontent.com');

//Check if user is logged in before proceeding
router.use(function(req, res, next) {
    // console.log(req.session.id);
    if (!('userData' in req.session)) {
        res.sendStatus(401);
    } else {
        next();
    }
});


// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/upload', upload.single('file'));

router.post('/upload', function (req, res, next) {
    // Get filename of image
    var avatar = req.file.filename;

    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		// Delete avatar from server
		var query = "SELECT avatar FROM user WHERE user_id = ?";
		connection.query(query, [req.session.user_id], function(err, rows, fields) {
			if (err) {
				res.sendStatus(500);
				return;
			}

			var filename = rows[0].avatar;
			fs.unlink("public/images/uploads/"+filename, function (err) {
				if (err) {
					console.log(err);
				}
			});
		});

		// Update user's avatar in database
		query = "UPDATE user SET avatar = ? WHERE user_id = ?;";
		connection.query(query, [avatar, req.session.user_id], function(err, rows, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				return;
			}
			// Update user session with avatar
			req.session.userData.avatar = avatar;

			res.end();
		});
	});


});

// Check that all incoming POST requests have the header content-type set as JSON
// Prevents CSRF attack through the use of hidden forms
router.post('*', function(req, res, next) {
    var content = req.get('Content-Type');
    if (content != "application/json") {
        res.sendStatus(412);
    }
    else {
        next();
    }
});

router.post('/logout', function(req, res, next) {
    delete req.session.userData;
    delete req.session.user_id;
    req.session.destroy;
    res.end();
});

router.get('/signupmethod', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var query = "SELECT only_open_id FROM user WHERE user_id = ?";
		connection.query(query, [req.session.user_id], function(err, user, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}
            res.json({onlyOpenID: user[0].only_open_id});
		});
	});
});

router.post('/setaccounttype', function(req, res, next) {

    var isManager = req.body.isManager;

    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var query = "UPDATE user SET is_manager = ? WHERE user_id = ?";
		connection.query(query, [isManager, req.session.user_id], function(err, user, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}
            res.send();
		});
	});
});

router.get('/getaccounttype', function(req, res, next) {

    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var query = "SELECT is_manager FROM user WHERE user_id = ?";
		connection.query(query, [req.session.user_id], function(err, user, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}
			// Set account type on the user session
			req.session.userData.is_manager = user[0].is_manager;
			// Send account type back to client
            res.json({isManager: user[0].is_manager});
		});
	});
});

// Mark google_login = true
router.post('/googleaccount', function(req, res, next) {

	var token = req.body.token;

	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: '93800279261-gth1fq4j4ukij0ecbrr0j1htrqpjjl0d.apps.googleusercontent.com'
		});
		const payload = ticket.getPayload();
		const googleEmail = payload['email'];

		req.pool.getConnection(function(err,connection) {
			if (err) {
				res.sendStatus(500);
				return;
			}

			var query = "UPDATE user SET google_email = ? WHERE user_id = ?";
			connection.query(query, [googleEmail, req.session.user_id], function(err, user, fields) {
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

				query = "UPDATE user SET google_login = true WHERE user_id = ?";
				connection.query(query, [req.session.user_id], function(err, user, fields) {
					connection.release(); // release connection
					if (err) {
						res.sendStatus(500);
						console.log(err);
						return;
					}
					res.end();
				});
			});
		});
	}
	verify().catch(console.error);
});

// Mark google_calendar = true
router.post('/googlecalendar', function(req, res, next) {
	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var query = "UPDATE user SET google_calendar = true WHERE user_id = ?";
		connection.query(query, [req.session.user_id], function(err, user, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}
			res.end();
		});
	});
});

// Mark google_calendar = false
router.post('/unlinkgooglecalendar', function(req, res, next) {
	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var query = "UPDATE user SET google_calendar = false WHERE user_id = ?";
		connection.query(query, [req.session.user_id], function(err, user, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}
			res.end();
		});
	});
});

router.post('/completeprofile', function(req, res, next) {
    var aboutMe = sanitizeHtml(req.body.aboutMe);

    req.pool.getConnection(function(err,connection) {
		if (err) {
            console.log("error 1");
			res.sendStatus(500);
			return;
		}

		// If user is manager
        if (req.session.userData.is_manager) {
            var query = "UPDATE user SET about_me = ?, google_calendar = ? WHERE user_id = ?;";
            connection.query(query, [aboutMe, req.body.googleCalendar, req.session.user_id], function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.end();
            });
        } else { // If user is member
            var availability = req.body.availability;
            query = "UPDATE user SET about_me = ?, google_calendar = ?, sunday = ?, monday = ?, tuesday = ?, wednesday = ?, thursday = ?, friday = ?, saturday = ? WHERE user_id = ?;";
            connection.query(query, [aboutMe, req.body.googleCalendar, availability.Sunday, availability.Monday, availability.Tuesday, availability.Wednesday,
                                    availability.Thursday, availability.Friday, availability.Saturday, req.session.user_id], function(err, rows, fields) {
                if (err) {
                    console.log("error 2");
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
            });

            // Clear previous task preferences, if any
            query = "DELETE FROM task_preference WHERE user_id = ?;";
            connection.query(query, [req.session.user_id], function(err, user, fields) {
                if (err) {
                    res.sendStatus(500);
                    console.log(err);
                    return;
                }
            });
            // Update task preferences
            var preferences = [];
            // Process data into a suitable format
            for (var i=0; i<req.body.preferences.length; i++) {
                preferences.push([req.session.user_id, req.body.preferences[i]]); // Add user_id column to each preference
            }
            query = "INSERT INTO task_preference (user_id, preference) VALUES ?;";
            connection.query(query, [preferences], function(err, user, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    console.log(err);
                    return;
                }
                res.end();
            });
        }
	});
});

router.post('/updateprofile', function(req, res, next) {
    console.log(req.body);

    var aboutMe = sanitizeHtml(req.body.aboutMe);

    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		// Update user's details
		// If user is manager
		if (req.session.userData.is_manager) {
            var query = "UPDATE user SET first_name = ?, last_name = ?, email = ?, about_me = ? WHERE user_id = ?;";
            connection.query(query, [req.body.firstName, req.body.lastName, req.body.email, aboutMe, req.session.user_id], function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    console.log("error 2");
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                res.end();
            });
		} else {
			// If user is member
            var availability = req.body.availability;
            query = "UPDATE user SET first_name = ?, last_name = ?, email = ?, about_me = ?, sunday = ?, monday = ?, tuesday = ?, " +
                        "wednesday = ?, thursday = ?, friday = ?, saturday = ? WHERE user_id = ?;";
            connection.query(query, [req.body.firstName, req.body.lastName, req.body.email, aboutMe, availability.Sunday, availability.Monday, availability.Tuesday,
                                    availability.Wednesday, availability.Thursday, availability.Friday, availability.Saturday, req.session.user_id], function(err, rows, fields) {
                if (err) {
                    console.log("error 2");
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
            });

            // Clear previous task preferences, if any
            query = "DELETE FROM task_preference WHERE user_id = ?;";
            connection.query(query, [req.session.user_id], function(err, user, fields) {
                if (err) {
                    res.sendStatus(500);
                    console.log(err);
                    return;
                }
            });

            // Update task preferences
            var preferences = [];

            // Process data into a suitable format
            for (var i=0; i<req.body.preferences.length; i++) {
                preferences.push([req.session.user_id, req.body.preferences[i]]); // Add user_id column to each preference
            }
            query = "INSERT INTO task_preference (user_id, preference) VALUES ?;";
            connection.query(query, [preferences], function(err, user, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    console.log(err);
                    return;
                }
                res.end();
            });
		}
	});
});

router.post('/deleteavatar', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		// Delete avatar from server
		var query = "SELECT avatar FROM user WHERE user_id = ?";
		connection.query(query, [req.session.user_id], function(err, rows, fields) {
			if (err) {
				res.sendStatus(500);
				return;
			}

			var filename = rows[0].avatar;
			fs.unlink("public/images/uploads/"+filename, function (err) {
				if (err) {
					console.log(err);
				}
			});
		});

		// Remove avatar from database
		query = "UPDATE user SET avatar = null WHERE user_id = ?";
		connection.query(query, [req.session.user_id], function(err, rows, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				return;
			}
			//Remove avatar from user session
			req.session.userData.avatar = null;

			res.end();
		});
	});
});

router.post('/updatepassword', function(req, res, next) {
    var oldPassword = req.body.password.old;
    var newPassword = req.body.password.new;

    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var query = "SELECT password_hash FROM user WHERE user_id = ?";
		connection.query(query, [req.session.user_id], async function(err, user, fields) {
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			// Verify password
			if (await argon2.verify(user[0].password_hash, oldPassword)) {
				// Password matches, hash new password and update the hash

				// Hash and salt password
				const hash = await argon2.hash(newPassword, {type: argon2.argon2id});

				// Update the hash
				var query = "UPDATE user SET password_hash = ? WHERE user_id = ?";
				connection.query(query, [hash, req.session.user_id], function(err, user, fields) {
					connection.release(); // release connection
					if (err) {
						res.sendStatus(500);
						console.log(err);
						return;
					}
					res.end();
				});
			} else { // Password does not match
				connection.release();
				res.sendStatus(401);
			}
		});
	});
});

router.get('/tasktypes', function(req, res, next) {
	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var query = "SELECT GROUP_CONCAT(name) AS task_types FROM task_type";
		connection.query(query, [req.session.user_id], function(err, rows, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}
			var taskTypes = rows[0].task_types.split(',');
            res.send(taskTypes);
		});
	});
});

router.get('/currentuser', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var query = "SELECT user_id, first_name, last_name, email, avatar, is_manager FROM user WHERE user_id = ?";
		connection.query(query, [req.session.user_id], function(err, user, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}
            var currentUser = {userid: user[0].user_id, firstName: user[0].first_name, lastName: user[0].last_name, email: user[0].email, avatar: user[0].avatar, isManager: user[0].is_manager};
            res.json(currentUser);
		});
	});
});

router.get('/profile', function(req, res, next) {

    var userProfile = {};
    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}
		var query = "SELECT user.user_id, user.first_name, user.last_name, user.email, user.avatar, user.about_me, " +
                    "user.google_login, user.facebook_login, user.google_calendar, user.sunday, user.monday, " +
                    "user.tuesday, user.wednesday, user.thursday, user.friday, user.saturday, user.only_open_id, " +
                    "GROUP_CONCAT(task_preference.preference) AS task_preferences, user.is_manager FROM user " +
                    "LEFT JOIN task_preference ON user.user_id = task_preference.user_id " +
                    "WHERE user.user_id = ? GROUP BY user.user_id;";
		connection.query(query, [req.session.user_id], function(err, user, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				return;
			}

			if (!req.session.userData.is_manager) {
                var availability = {Sunday: user[0].sunday, Monday: user[0].monday, Tuesday: user[0].tuesday, Wednesday: user[0].wednesday, Thursday: user[0].thursday, Friday: user[0].friday, Saturday: user[0].saturday};
                var preferences = user[0].task_preferences.split(','); // Split string to array
			} else {
                availability = null;
                preferences = null;
			}

			userProfile = {userid: user[0].user_id, firstName: user[0].first_name, lastName: user[0].last_name, email: user[0].email, avatar: user[0].avatar, aboutMe: user[0].about_me,
                            onlyOpenID: user[0].only_open_id,
                            socialMedia: {google: user[0].google_login, facebook: user[0].facebook_login},
                            onlineCalendar: {google: user[0].google_calendar},
                            availability: availability, preferences: preferences, isManager: user[0].is_manager};

			res.json(userProfile);
		});
	});

});

router.get('/tasks', function(req, res, next) {

    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}
		// Retrieve tasks
		var query = "SELECT task.task_id AS taskid, task.title, task.priority, task.status, task.task_type AS type, task.due_date AS dueDate, task.req_approval AS reqApproval, " +
                    "task.pending, task.completed, task.completed_date AS completedDate FROM task INNER JOIN user_has_task ON task.task_id = user_has_task.task_id WHERE user_has_task.user_id = ?";
		connection.query(query, [req.session.user_id], function(err, tasks, fields) {
			if (err) {
				res.sendStatus(500);
				return;
			}

			// If user has no tasks, return
			if (tasks.length == 0) {
				res.send(tasks);
				return;
			}

            // Create fields for manager, team and dialogue posts
            for (var i=0; i<tasks.length; i++) {
                tasks[i].manager = {};
                tasks[i].team = [];
                tasks[i].dialogues = [];
            }

            // Get task IDs
            var task_ids = [];
            for (var i=0; i<tasks.length; i++) {
                task_ids.push(tasks[i].taskid);
            }

            // Retrieve teams
            var query = "SELECT user_has_task.task_id AS taskid, user.user_id AS userid, CONCAT(user.first_name, ' ', user.last_name) AS name, user.avatar, user.is_manager AS isManager FROM user " +
                        "INNER JOIN user_has_task ON user.user_id = user_has_task.user_id WHERE user_has_task.task_id IN (?)";
            connection.query(query, [task_ids], function(err, teams, fields) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }

                // Add teams to the tasks
                for (var i=0; i<teams.length; i++) {
                    for (var j=0; j<tasks.length; j++) {
                        if (teams[i].taskid == tasks[j].taskid) {
                            var user = {userid: teams[i].userid, name: teams[i].name, avatar: teams[i].avatar};
                            if (teams[i].isManager == true) {
                                tasks[j].manager = user;
                                break; // Move onto next user
                            } else {
                                // User is not manager, push user to team
                                tasks[j].team.push(user);
                                break; // Move onto next user
                            }
                        }
                    }
                }

                // Retrieve dialogue posts
				var query = "SELECT dialogue_post.task_id AS taskid, dialogue_post.post_id AS postid, CONCAT(user.first_name, ' ',user.last_name) AS author, " +
							"user.avatar, dialogue_post.date_authored AS date, dialogue_post.subject, dialogue_post.content, dialogue_post.edit_date AS editDate FROM dialogue_post " +
                            "INNER JOIN user_has_task ON dialogue_post.task_id = user_has_task.task_id " +
                            "INNER JOIN user ON user.user_id = dialogue_post.author WHERE user_has_task.user_id = ?";
				connection.query(query, [req.session.user_id], function(err, posts, fields) {
					connection.release(); // release connection
					if (err) {
						res.sendStatus(500);
						return;
					}

                    // Add dialogue posts to the tasks
					for (var i=0; i<posts.length; i++) {
                        for (var j=0; j<tasks.length; j++) {
                            if (posts[i].taskid == tasks[j].taskid) {
                                post = {postid: posts[i].postid, author: {name: posts[i].author, avatar: posts[i].avatar}, date: posts[i].date, subject: posts[i].subject, content: posts[i].content, editDate: posts[i].editDate};
                                tasks[j].dialogues.push(post);
                                break; // Move onto next post
                            }
                        }
					}

					res.json(tasks);
				});
			});
		});
	});
});

router.post('/updatestatus', function(req, res, next) {
    var taskid = req.body.taskid;
    var status = req.body.status;
    var completedDate = Date.parse(new Date);
    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		// If task is complete
		if (status == "Done") {
			var query = "UPDATE task SET status = 'Done', pending = false, completed = true, completed_date = ? WHERE task_id = ?";
			connection.query(query, [completedDate, taskid], function(err, user, fields) {
				connection.release(); // release connection
				if (err) {
					res.sendStatus(500);
					console.log(err);
					return;
				}
				res.end();
			});
		} else {
			query = "UPDATE task SET status = ? WHERE task_id = ?";
			connection.query(query, [status, taskid], function(err, user, fields) {
				connection.release(); // release connection
				if (err) {
					res.sendStatus(500);
					console.log(err);
					return;
				}
				res.end();
			});
		}
	});
});

router.post('/addpost', function(req, res, next) {
    var taskid = req.body.taskid;
    var post = req.body.newPost;
    var postid = "";

    // Reassigning logged in user's data to the post in case of tampering on client side
    post.author.userid = req.session.user_id;
    post.author.name = req.session.userData.first_name + " " + req.session.userData.last_name;
    post.author.avatar = req.session.userData.avatar;
    var date = Date.parse(new Date);

	console.log(post);

    // Sanitise input
    // post.subject = sanitizeHtml(post.subect);
    post.content = sanitizeHtml(post.content);

    // Remove unnecessary newline characters
    post.content = post.content.replace(/\r?\n|\r/g, "");

    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		var query = "INSERT INTO dialogue_post SET task_id = ?, author = ?, date_authored = ?, subject = ?, content = ?";
		connection.query(query, [taskid, req.session.user_id, date, post.subject, post.content], function(err, rows, fields) {
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			// Get ID of the post just created
			query = "SELECT post_id FROM dialogue_post WHERE post_id = LAST_INSERT_ID()";
			connection.query(query, function(err, posts, fields) {
				if (err) {
					res.sendStatus(500);
					console.log(err);
					return;
				}

				// Add postid field to post object
				post.postid = posts[0].post_id;
				// Send post back so client can update the page accordingly
				res.send(post);
			});
		});

		// If user has requested to complete task
		if (req.body.reqToComplete) {
            // Check if task requires approval to complete
            query = "SELECT req_approval FROM task WHERE task_id = ?";
            connection.query(query, [taskid], function(err, task, fields) {
                if (err) {
                    res.sendStatus(500);
                    console.log(err);
                    return;
                }

                // If task requires approval, set pending
                if (task[0].req_approval) {
                    query = "UPDATE task SET status = 'Pending approval', pending = true WHERE task_id = ?";
                    connection.query(query, [taskid], function(err, task, fields) {
                        if (err) {
                            res.sendStatus(500);
                            console.log(err);
                            return;
                        }
                    });
                } else { // Task does not require approval, mark as complete
                    query = "UPDATE task SET status = 'Done', completed = true, completed_date = ? WHERE task_id = ?";
                    var completedDate = Date.parse(new Date);
                    connection.query(query, [completedDate, taskid], function(err, task, fields) {
                        if (err) {
                            res.sendStatus(500);
                            console.log(err);
                            return;
                        }
                    });
                }
            });
		}

		// Release connection
		connection.release();
	});
});

router.post('/editpost', function(req, res, next) {
    var editedPost = req.body;
    var postid = editedPost.postid;
    editedPost.editDate = Date.parse(new Date);

    // Sanitise input
    // post.subject = sanitizeHtml(editedPost.subect);
    editedPost.content = sanitizeHtml(editedPost.content);

    // Remove unnecessary newline characters
    editedPost.content = editedPost.content.replace(/\r?\n|\r/g, "");

    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

        // Check if current user is the author of the post
        var query = "SELECT author FROM dialogue_post WHERE post_id = ?";
		connection.query(query, [postid], function(err, post, fields) {
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			// If user is author, allow edit
			if (post[0].author == req.session.user_id) {
                query = "UPDATE dialogue_post SET subject = ?, content = ?, edit_date = ? WHERE post_id = ?";
                connection.query(query, [editedPost.subject, editedPost.content, editedPost.editDate, postid], function(err, rows, fields) {
                    connection.release(); // release connection
                    if (err) {
                        res.sendStatus(500);
                        console.log(err);
                        return;
                    }

                    res.json(editedPost);
                });
			} else { // If user is not author, return 403
				connection.release();
				res.sendStatus(403);
			}

		});
	});
});

router.post('/deletepost', function(req, res, next) {

	var postid = req.body.postid;

	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

        // Check if current user is the author of the post
        var query = "SELECT author FROM dialogue_post WHERE post_id = ?";
		connection.query(query, [postid], function(err, post, fields) {
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			// If user is author, allow delete
			if (post[0].author == req.session.user_id) {
                query = "DELETE FROM dialogue_post WHERE post_id = ?;";
                connection.query(query, [postid], function(err, rows, fields) {
                    connection.release(); // release connection
                    if (err) {
                        res.sendStatus(500);
                        console.log(err);
                        return;
                    }

                    res.end();
                });
			} else { // If user is not author, return 403
				connection.release();
				res.sendStatus(403);
			}

		});
	});
});

// Routes that are only accessible by managers

router.use('/managers', function(req, res, next) {
	if (!(req.session.userData.is_manager)) {
		res.sendStatus(403);
	} else {
		next();
	}
});

router.get('/managers/memberslist', function(req, res, next) {

	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

        // Get list of members
        var query = "SELECT user_id AS userid, CONCAT(first_name, ' ', last_name) AS name, avatar FROM user WHERE is_manager = false ORDER BY name";
		connection.query(query, function(err, members, fields) {
			connection.release();
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			res.send(members);
		});
	});
});

// Search for users
router.get('/managers/search', function(req, res, next) {

	var results = [];
	var q = req.query.q.toLowerCase();


	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			console.log(err);
			return;
		}
		var query = "SELECT user.user_id, CONCAT(user.first_name, ' ', user.last_name) AS name, user.email, user.avatar, user.about_me, user.is_manager, " +
					"user.sunday, user.monday, user.tuesday, user.wednesday, user.thursday, user.friday, " +
					"user.saturday, GROUP_CONCAT(task_preference.preference) AS task_preferences FROM user " +
					"LEFT JOIN task_preference ON user.user_id = task_preference.user_id " + // Left join as managers don't have preferences
					"WHERE CONCAT(user.first_name, ' ', user.last_name) LIKE CONCAT('%', ?,  '%') " +
					"GROUP BY user.user_id";

		connection.query(query, [q], function(err, users, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			// Reconstruct the user object for each matching result
			for (var i=0; i<users.length; i++) {

				// Only reconstruct availability / preferences if user is a member
				if (!users[i].is_manager) {
					var availability = {Sunday: users[i].sunday, Monday: users[i].monday, Tuesday: users[i].tuesday, Wednesday: users[i].wednesday, Thursday: users[i].thursday, Friday: users[i].friday, Saturday: users[i].saturday};
					var preferences = users[i].task_preferences.split(',');
				} else {
					availability = null;
					preferences = null;
				}

				var userProfile = {userid: users[i].user_id, name: users[i].name, email: users[i].email, avatar: users[i].avatar, aboutMe: users[i].about_me,
								availability: availability, preferences: preferences, isManager: users[i].is_manager};

				// Push profile to results
				results.push(userProfile);

			}

			res.json(results);
		});
	});
});

router.post('/managers/addnewtasktype', function(req, res, next) {

	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			console.log(err);
			return;
		}

		var query = "INSERT INTO task_type SET name = ?";

		connection.query(query, [req.body.taskType], function(err, users, fields) {
			connection.release(); // release connection
			if (err) {
				// If task type already exists
				if (err.code === 'ER_DUP_ENTRY') {
					res.sendStatus(409); // Return conflict error code
					return;
				} else {
					res.sendStatus(500);
					console.log(err);
					return;
				}
			}

			res.send();
		});
	});
});

router.post('/managers/checkpreferences', function(req, res, next) {
	var team = req.body;

	// Get array of userids of the team
	var userids = [];
	for (var i=0; i<team.length; i++) {
		userids.push(team[i].userid);
	}

	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			console.log(err);
			return;
		}

		var query = "SELECT user_id AS userid, GROUP_CONCAT(task_preference.preference) AS task_preferences FROM task_preference WHERE user_id IN (?) GROUP BY userid";

		connection.query(query, [userids], function(err, users, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			for (var i=0; i<users.length; i++) {

				// Reconstruct preferences
				var preferences = users[i].task_preferences.split(',');

				// Attach preferences to matching team member
				for (var j=0; j<team.length; j++) {
					if (users[i].userid == team[j].userid) {
						team[j].preferences = preferences;
						break; // Move onto next team member
					}
				}
			}

			res.json(team);
		});
	});
});

router.post('/managers/checkavailability', function(req, res, next) {

	var team = req.body;

	// Get array of userids of the team
	var userids = [];
	for (var i=0; i<team.length; i++) {
		userids.push(team[i].userid);
	}

	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			console.log(err);
			return;
		}

		var query = "SELECT user.user_id AS userid, user.sunday, user.monday, user.tuesday, user.wednesday, user.thursday, user.friday, user.saturday FROM user WHERE user_id IN (?)";

		connection.query(query, [userids], function(err, users, fields) {
			connection.release(); // release connection
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			for (var i=0; i<users.length; i++) {

				// Reconstruct availability
				var availability = {Sunday: users[i].sunday, Monday: users[i].monday, Tuesday: users[i].tuesday, Wednesday: users[i].wednesday, Thursday: users[i].thursday, Friday: users[i].friday, Saturday: users[i].saturday};

				// Attach availability to matching team member
				for (var j=0; j<team.length; j++) {
					if (users[i].userid == team[j].userid) {
						team[j].availability = availability;
						break; // Move onto next team member
					}
				}
			}

			res.json(team);
		});
	});
});

router.post('/managers/addtask', function(req, res, next) {

	var task = req.body;
    var team = req.body.team;
    var post = task.dialogues[0];
    var date = Date.parse(new Date);

    // Sanitise input
    task.title = sanitizeHtml(task.title);
    post.content = sanitizeHtml(post.content);

    // Remove unnecessary newline characters
    post.content = post.content.replace(/\r?\n|\r/g, "");

    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			console.log(err);
			return;
		}

		// Create the task
		var query = "INSERT INTO task SET title = ?, priority = ?, status = 'Not started', task_type = ?, due_date = ?, req_approval = ?, pending = false, completed = false";
		connection.query(query, [task.title, task.priority, task.type, task.dueDate, task.reqApproval], function(err, rows, fields) {
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			// Get ID of the task just created
			query = "SELECT task_id FROM task WHERE task_id = LAST_INSERT_ID()";
			connection.query(query, function(err, task, fields) {
				if (err) {
					res.sendStatus(500);
					console.log(err);
					return;
				}

				var taskid = task[0].task_id;

				// Create array of all users involved in the task, with task id
				var users = [[req.session.user_id, taskid]]; // Task manager
				// Create array of user ids of members involved in the task, to extract email addresses to add to Google calendar
				var membersids = [];
				// Add team members
				for (var i=0; i<team.length; i++) {
					users.push([team[i].userid, taskid]);
					membersids.push(team[i].userid);
				}

				// Adding users to tasks
				query = "INSERT INTO user_has_task (user_id, task_id) VALUES ?;";
				connection.query(query, [users], function(err, rows, fields) {
					if (err) {
						res.sendStatus(500);
						console.log(err);
						return;
					}
				});

				// Add task details
				query = "INSERT INTO dialogue_post SET task_id = ?, author = ?, date_authored = ?, subject = 'Task details', content = ?";
				connection.query(query, [taskid, req.session.user_id, date, post.content], function(err, rows, fields) {
					if (err) {
						res.sendStatus(500);
						console.log(err);
						return;
					}
				});

				// Get members' emails, but only those that have their calendar linked
				query = "SELECT email FROM user WHERE google_calendar = true AND user_id IN (?)";
				connection.query(query, [membersids], function(err, users, fields) {
					connection.release();
					if (err) {
						res.sendStatus(500);
						console.log(err);
						return;
					}

					var membersEmails = users;

					// Return the taskid and members' emails
					res.json({taskid: taskid, membersEmails: membersEmails});
				});
			});
		});
    });
});

// Insert the task's calendar eventid into database
router.post('/managers/eventid', function(req, res, next) {
    var taskid = req.body.taskid;
    var eventid = req.body.eventid;

    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		// Check if user is the task manager
		var query = "SELECT user_has_task.user_id from user_has_task " +
					"INNER JOIN user ON user.user_id = user_has_task.user_id WHERE user.is_manager = true AND user_has_task.task_id = ?";
		connection.query(query, [taskid], function(err, user, fields) {
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			// If user is the task manager, insert calendar eventid
			if (user[0].user_id == req.session.user_id) {
				query = "UPDATE task SET event_id = ? WHERE task_id = ?";
				connection.query(query, [eventid, taskid], function(err, user, fields) {
					connection.release(); // release connection
					if (err) {
						res.sendStatus(500);
						console.log(err);
						return;
					}

					res.end();
				});
			} else { // Otherwise send 403
				connection.release();
				res.sendStatus(403);
			}
		});
	});
});

router.post('/managers/edittask', function(req, res, next) {

	var task = req.body;
	var taskid = req.body.taskid;
	var postid = req.body.postid;
	var newTeam = req.body.newTeam;
	var toRemove = req.body.toRemove; // Contains an array of userid of members to remove from task

	// Sanitise input
    task.newDetails = sanitizeHtml(task.newDetails);

    // Remove unnecessary newline characters
    task.newDetails = task.newDetails.replace(/\r?\n|\r/g, "");

	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			console.log(err);
			return;
		}

		// Check if user is the task manager
		var query = "SELECT user_has_task.user_id from user_has_task " +
					"INNER JOIN user ON user.user_id = user_has_task.user_id WHERE user.is_manager = true AND user_has_task.task_id = ?";
		connection.query(query, [taskid], function(err, user, fields) {
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			// If user is the task manager, allow edit
			if (user[0].user_id == req.session.user_id) {

				// Update the task
				var query = "UPDATE task SET title = ?, priority = ?, task_type = ?, due_date = ?, req_approval = ? WHERE task_id = ?";
				connection.query(query, [task.newTitle, task.newPriority, task.newType, task.newDueDate, task.newReqApproval, taskid], function(err, rows, fields) {
					if (err) {
						res.sendStatus(500);
						console.log(err);
						return;
					}

					// Remove users from tasks, only if there are users to remove
					if (toRemove.length > 0) {
						query = "DELETE FROM user_has_task WHERE task_id = ? AND user_id IN (?)";
						connection.query(query, [taskid, toRemove], function(err, rows, fields) {
							if (err) {
								res.sendStatus(500);
								console.log(err);
								return;
							}
						});
					}

					// Create array of users involved in the task
					var users = [];
					// Create array if user ids of members involved in the task
					var membersids = [];
					// Add team members
					for (var i=0; i<newTeam.length; i++) {
						users.push([newTeam[i].userid, taskid]);
						membersids.push(newTeam[i].userid);
					}

					// Adding users to tasks
					query = "INSERT IGNORE INTO user_has_task (user_id, task_id) VALUES ?;";
					connection.query(query, [users], function(err, rows, fields) {
						if (err) {
							res.sendStatus(500);
							console.log(err);
							return;
						}
					});

					// Update task details
					query = "UPDATE dialogue_post SET content = ? WHERE post_id = ?;";
					connection.query(query, [task.newDetails, task.postid], function(err, rows, fields) {
						if (err) {
							res.sendStatus(500);
							console.log(err);
							return;
						}
					});

					// Get calendar event id to update calendar
					query = "SELECT event_id FROM task WHERE task_id = ?";
					connection.query(query, [taskid], function(err, rows, fields) {
						if (err) {
							res.sendStatus(500);
							console.log(err);
							return;
						}

						var eventid = rows[0].event_id;

						// Get members' emails, but only those that have their calendar linked
						query = "SELECT email FROM user WHERE google_calendar = true AND user_id IN (?)";
						connection.query(query, [membersids], function(err, users, fields) {
							connection.release();
							if (err) {
								res.sendStatus(500);
								console.log(err);
								return;
							}

							var membersEmails = users;

							// Return the eventid and members' emails
							res.json({eventid: eventid, membersEmails: membersEmails});
						});
					});
				});
			} else { // If user is not task manager, send 403
				connection.release();
				res.sendStatus(403);
			}
		});
    });
});

router.post('/managers/completetask', function(req, res, next) {
    var taskid = req.body.taskid;
    var completedDate = Date.parse(new Date);
    req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		// Check if user is the task manager
		var query = "SELECT user_has_task.user_id from user_has_task " +
					"INNER JOIN user ON user.user_id = user_has_task.user_id WHERE user.is_manager = true AND user_has_task.task_id = ?";
		connection.query(query, [taskid], function(err, user, fields) {
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			// If user is the task manager, mark task complete
			if (user[0].user_id == req.session.user_id) {
				query = "UPDATE task SET status = 'Done', pending = false, completed = true, completed_date = ? WHERE task_id = ?";
				connection.query(query, [completedDate, taskid], function(err, user, fields) {
					connection.release(); // release connection
					if (err) {
						res.sendStatus(500);
						console.log(err);
						return;
					}

					res.end();
				});
			} else { // Otherwise send 403
				connection.release();
				res.sendStatus(403);
			}
		});
	});
});

router.post('/managers/deletetask', function(req, res, next) {
	var taskid = req.body.taskid;

	req.pool.getConnection(function(err,connection) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		// Check if user is the task manager
		var query = "SELECT user_has_task.user_id from user_has_task " +
					"INNER JOIN user ON user.user_id = user_has_task.user_id WHERE user.is_manager = true AND user_has_task.task_id = ?";
		connection.query(query, [taskid], function(err, user, fields) {
			if (err) {
				res.sendStatus(500);
				console.log(err);
				return;
			}

			// If user is the task manager, allow delete
			if (user[0].user_id == req.session.user_id) {
				// Get calendar event id to delete calendar event
				var query = "SELECT event_id FROM task WHERE task_id = ?";
				connection.query(query, [taskid], function(err, rows, fields) {
					if (err) {
						res.sendStatus(500);
						console.log(err);
						return;
					}

					var eventid = rows[0].event_id;

					// Delete task
					query = "DELETE FROM task WHERE task_id = ?";
					connection.query(query, [taskid], function(err, user, fields) {
						connection.release(); // release connection
						if (err) {
							res.sendStatus(500);
							console.log(err);
							return;
						}

						res.send(eventid);
					});
				});
			} else { // If user not task manager, send 403
				connection.release();
				res.sendStatus(403);
			}
		});
	});
});

module.exports = router;
