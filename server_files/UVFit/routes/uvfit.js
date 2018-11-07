var express = require('express');
var router = express.Router();
var fs = require('fs');
var UVFit = require("../models/uvfit");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");

// Register a UVFit device for a user, POST
router.post('/', function (req, res, next) {
	// TODO: Validate email
	var emailValid = true;

	if (!emailValid) {
		// Error can occur if a duplicate email is sent
		return res.status(400).json({ success: false, message: "Invalid valid email address." });
	}

	// TODO: Validate device ID
	var deviceIdValid = true;

	if (!deviceIdValid) {
		// Error can occur if a duplicate email is sent
		return res.status(400).json({ success: false, message: "Invalid device ID." });
	}


	// Create an entry for the UV Fit
	var newUVFit = new UVFitDataEntry({
		email: req.body.email,
		deviceId: req.body.deviceId,
		apiKey: req.body.apiKey,
	});

	newUVFit.save(function (err, user) {
		if (err) {
			// Error can occur if a duplicate email is sent
			res.status(400).json({ success: false, message: err.errmsg });
		}
		else {
			res.status(201).json({ success: true, message: "UV Fit registered for " + req.body.email + " has been created." })
		}
	});
});

// TODO: Implement GET method on /uvfit/
router.get("/", function (req, res, next) {
	res.status(501).json({ success: false, message: "UVFit GET endpoint not implemented." });
});

router.get("/:id", function (req, res, next) {
	res.status(501).json({ success: false, message: "UVFit ID GET endpoint not implemented." });
});

// TODO: Implement PUT method on /uvfit/
router.put("/:id", function (req, res, next) {
	res.status(501).json({ success: false, message: "UVFit PUT endpoint not implemented." });
});

// TODO: Implement DELETE method on /uvfit/
router.delete("/:id", function (req, res, next) {
	res.status(501).json({ success: false, message: "UVFit DELETE endpoint not implemented." });
});

// Set up the export
module.exports = router;
