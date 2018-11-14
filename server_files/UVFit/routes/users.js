var express = require('express');
var router = express.Router();
var fs = require('fs');
var UVFitUser = require("../models/users");
var UVFit = require("../models/uvfit");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");

var secret = 'uvfit';

// Login existing users
router.post('/login', function (req, res, next) {
	UVFitUser.findOne({ email: req.body.email }, function (err, user) {
		if (err) {
			return res.status(500).json({ success: false, error: "Error communicating with database." });
		}
		else if (!user) {
			return res.status(401).json({ success: false, error: "The email or password provided was invalid." });
		}
		else {
			bcrypt.compare(req.body.password, user.passwordHash, function (err, valid) {
				if (err) {
					return res.status(401).json({ success: false, error: "Error authenticating." });
				}
				else if (valid) {
					// update last access
					user.lastAccess = Date.now();
					user.save(function (err, newUser) {
						console.log("User " + newUser.email + " new last access of " + newUser.lastAccess);
					});

					// determine if they have a registered device
					UVFit.findOne({ email: req.body.email }, function (err, uvFit) {
						if (err) {
							return res.status(500).json({ success: false, error: "Error communicating with database." });
						}
						else {
							// send the user their auth token
							var token = jwt.encode({ email: req.body.email }, secret);
							if (uvFit) {
								return res.status(201).json({ success: true, email: req.body.email, token: token, deviceId: uvFit.deviceId, apiKey: uvFit.apiKey });
							} else {
								return res.status(201).json({ success: true, email: req.body.email, token: token, deviceId: null, apiKey: null });
							}
						}
					});
				}
				else {
					return res.status(401).json({ success: false, error: "The email or password provided was invalid." });
				}
			});
		}
	});
});

// Register new users, POST
router.post('/register', function (req, res, next) {
	// Ensure correct POST method
	if (!req.is('application/json')) {
		return res.status(400).json({ success: false, error: "Invalid POST. It should be application/json." });
	}

	// Make sure all params exist
	if (!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("fullName") || !req.body.hasOwnProperty("password")) {
		return res.status(400).json({ success: false, error: "Please enter all necessary parameters." });
	}

	// Validate email addresses
	var emailValid = true;
	var reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	if (!reEmail.test(req.body.email)) {
		// Error can occur if a duplicate email is sent. We won't worry about it for now
		return res.status(400).json({ success: false, error: "Invalid email address." });
	}

	// Validate password criteria of 8 chars, upper case, lower case, 1 number
	var passwordValid = true;
	var reLowerCase = /[a-z]/;
	var reUpperCase = /[A-Z]/;
	var reNumber = /[0-9]/;
	if (req.body.password.length < 8 || !reLowerCase.test(req.body.password) || !reUpperCase.test(req.body.password) || !reNumber.test(req.body.password)) {
		passwordValid = false;
	}
	if (!passwordValid) {
		return res.status(400).json({ success: false, error: "Invalid password. Ensure your password meets our password criteria." });
	}

	// If all items validate, create new user
	bcrypt.hash(req.body.password, null, null, function (err, hash) {
		// Create an entry for the user
		var newUser = new UVFitUser({
			email: req.body.email,
			fullName: req.body.fullName,
			passwordHash: hash // hashed password
		});

		newUser.save(function (err, user) {
			if (err) {
				return res.status(500).json({ success: false, error: err.errmsg });
			}
			else {
				return res.status(201).json({ success: true, message: "Account for " + user.fullName + " (" + user.email + ") has been created." });
			}
		});
	});
});

// Implement GET method on /users/
router.get("/", function (req, res, next) {
	UVFitUser.find({}, function (err, users) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else {
			return res.status(200).json({ success: true, registeredUsers: users });
		}
	});
});

router.get("/:email", function (req, res, next) {
	UVFitUser.find({ email: req.params.email }, function (err, user) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else {
			return res.status(200).json({ success: true, registeredUser: user });
		}
	});
});

// Implement PUT method on /users/
router.put("/update/:email", function (req, res, next) {
	UVFitUser.findOne({ email: req.params.email }, function (err, user) {
		if (err) {
			return res.status(500).json({ success: false, error: "Error communicating with database." });
		}
		else if (!user) {
			return res.status(401).json({ success: false, error: "The email provided was invalid." });
		}
		else {
			// Make sure all params exist
			if (!req.body.hasOwnProperty("fullName") || !req.body.hasOwnProperty("password")) {
				return res.status(400).json({ success: false, error: "Please enter all necessary parameters." });
			}

			// Validate email addresses
			var emailValid = true;
			var reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			if (!reEmail.test(req.params.email)) {
				// Error can occur if a duplicate email is sent. We won't worry about it for now
				return res.status(400).json({ success: false, error: "Invalid email address." });
			}

			// Validate password criteria of 8 chars, upper case, lower case, 1 number
			var passwordValid = true;
			var reLowerCase = /[a-z]/;
			var reUpperCase = /[A-Z]/;
			var reNumber = /[0-9]/;
			if (req.body.password.length < 8 || !reLowerCase.test(req.body.password) || !reUpperCase.test(req.body.password) || !reNumber.test(req.body.password)) {
				passwordValid = false;
			}
			if (!passwordValid) {
				return res.status(400).json({ success: false, error: "Invalid password. Ensure your password meets our password criteria." });
			}

			// If all items validate, update user
			bcrypt.hash(req.body.password, null, null, function (err, hash) {
				user.passwordHash = hash;
				user.fullName = req.body.fullName;

				user.save(function (err, user) {
					if (err) {
						return res.status(500).json({ success: false, error: err.errmsg });
					}
					else {
						return res.status(204).json({ success: true, message: "Account for " + user.email + " has been updated." });
					}
				});
			});
		}
	});
});

// Implement DELETE method on /users/
router.delete("/delete/:email", function (req, res, next) {
	UVFitUser.deleteOne({ email: req.params.email }, function (err, user) {
		if (err) {
			return res.status(500).json({ success: false, error: "Error communicating with database." });
		}
		else if (!user) {
			return res.status(400).json({ success: false, error: "The email provided was invalid." });
		}
		else {
			return res.status(204).json({ success: true, message: "Account for " + user.email + " has been deleted." });
		}
	});
});

// Set up the export
module.exports = router;
