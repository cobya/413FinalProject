var express = require('express');
var router = express.Router();
var fs = require('fs');
var UVFitUser = require("../models/users");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");

var secret = 'uvfit';

// Register a test GET endpoint
router.get("/test", function (req, res, next) {
	// Send stringified object in response with response code 200
	var testMsg = {
		message: "Test"
	}
	res.status(200).send(JSON.stringify(testMsg));
});

// Login existing users
router.post('/login', function (req, res, next) {
	UVFitUser.findOne({ email: req.body.email }, function (err, user) {
		if (err) {
			res.status(401).json({ success: false, error: "Error communicating with database." });
		}
		else if (!user) {
			res.status(401).json({ success: false, error: "The email or password provided was invalid." });
		}
		else {
			bcrypt.compare(req.body.password, user.passwordHash, function (err, valid) {
				if (err) {
					res.status(401).json({ success: false, error: "Error authenticating." });
				}
				else if (valid) {
					var token = jwt.encode({ email: req.body.email }, secret);
					res.status(201).json({ success: true, token: token });
				}
				else {
					res.status(401).json({ success: false, error: "The email or password provided was invalid." });
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
		// Error can occur if a duplicate email is sent
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
				res.status(400).json({ success: false, message: err.errmsg });
			}
			else {
				res.status(201).json({ success: true, message: "Account for " + user.fullName + " (" + user.email + ") has been created." })
			}
		});
	});
});

// TODO: Implement GET method on /users/
router.get("/", function (req, res, next) {
	res.status(501).json({ success: false, message: "Users GET endpoint not implemented." });
});

router.get("/:id", function (req, res, next) {
	res.status(501).json({ success: false, message: "User ID GET endpoint not implemented." });
});

// TODO: Implement PUT method on /users/
router.put("/update/:id", function (req, res, next) {
	res.status(501).json({ success: false, message: "Users PUT endpoint not implemented." });
});

// TODO: Implement DELETE method on /users/
router.delete("/delete/:id", function (req, res, next) {
	res.status(501).json({ success: false, message: "Users DELETE endpoint not implemented." });
});

// Set up the export
module.exports = router;
