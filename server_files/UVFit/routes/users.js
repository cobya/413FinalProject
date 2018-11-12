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
		return res.status(400).json({ success: false, message: "Invalid POST. It should be application/json." });
	}

	// Make sure all params exist
	if (!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("fullName") || !req.body.hasOwnProperty("password")) {
		return res.status(400).json({ success: false, message: "Please enter all necessary parameters." });
	}

	// Validate email addresses
	var emailValid = true;
	var reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	if (!reEmail.test(req.body.email)) {
		// Error can occur if a duplicate email is sent. We won't worry about it for now
		return res.status(400).json({ success: false, message: "Invalid email address." });
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
		return res.status(400).json({ success: false, message: "Invalid password. Ensure your password meets our password criteria." });
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
				// Error can occur if a duplicate email is sent
				return res.status(400).json({ success: false, message: err.errmsg });
			}
			else {
				return res.status(201).json({ success: true, message: "Account for " + user.fullName + " (" + user.email + ") has been created." })
			}
		});
	});
});

// TODO: Implement GET method on /users/
router.get("/", function (req, res, next) {
	return res.status(501).json({ success: false, message: "Users GET endpoint not implemented." });
});

router.get("/:email", function (req, res, next) {
	return res.status(501).json({ success: false, message: "User ID GET endpoint not implemented." });
});

// TODO: Implement PUT method on /users/
router.put("/update/:email", function (req, res, next) {
	return res.status(501).json({ success: false, message: "Users PUT endpoint not implemented." });
});

// TODO: Implement DELETE method on /users/
router.delete("/delete/:email", function (req, res, next) {
	return res.status(501).json({ success: false, message: "Users DELETE endpoint not implemented." });
});

// Set up the export
module.exports = router;
