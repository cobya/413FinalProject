var express = require('express');
var router = express.Router();
var fs = require('fs');
var UVFitUser = require("../models/users");
var UVFit = require("../models/uvfit");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");

var secret = 'uvfit';

// Register a UVFit device for a user, POST
router.post('/register', function (req, res, next) {
	// Validate email exists and has no deviceId registered
	UVFitUser.findOne({ email: req.body.email }, function (err, user) {
		if (err) {
			return res.status(500).json({ success: false, error: "Error communicating with database." });
		}
		else if (!user) {
			return res.status(400).json({ success: false, error: "There is no account associated with that email." });
		}
		else {
			UVFit.findOne({ email: req.body.email }, function (err, uvFit) {
				if (err) {
					return res.status(500).json({ success: false, error: "Error communicating with database." });
				}
				else if (uvFit) {
					return res.status(400).json({ success: false, error: "There is already a device associated with that email." });
				}
				else {
					// Hash their device ID to return an APIKEY and create a new UV Fit
					bcrypt.hash(req.body.deviceId, null, null, function (err, hash) {
						var newUVFit = new UVFit({
							email: req.body.email,
							deviceId: req.body.deviceId,
							apiKey: hash
						});

						newUVFit.save(function (err, user) {
							if (err) {
								// Error can occur if a duplicate email is sent
								return res.status(400).json({ success: false, message: err.errmsg });
							}
							else {
								return res.status(201).json({ success: true, message: "UVFit (" + req.body.deviceId + ") registered  for " + user.email + " with apiKey " + hash })
							}
						});
					});
				}
			});
		}
	});
});

// TODO: Implement GET method on /uvfit/
router.get("/", function (req, res, next) {
	return res.status(501).json({ success: false, message: "UVFit GET endpoint not implemented." });
});

router.get("/:email", function (req, res, next) {
	return res.status(501).json({ success: false, message: "UVFit ID GET endpoint not implemented." });
});

// TODO: Implement PUT method on /uvfit/
router.put("/update/:email", function (req, res, next) {
	return res.status(501).json({ success: false, message: "UVFit PUT endpoint not implemented." });
});

// TODO: Implement DELETE method on /uvfit/
router.delete("/delete/:email", function (req, res, next) {
	return res.status(501).json({ success: false, message: "UVFit DELETE endpoint not implemented." });
});

// Set up the export
module.exports = router;
