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
								return res.status(400).json({ success: false, error: err.errmsg });
							}
							else {
								return res.status(201).json({ success: true, message: "UVFit (" + req.body.deviceId + ") registered  for " + user.email + " with apiKey " + hash, apiKey: hash, deviceId: req.body.deviceId });
							}
						});
					});
				}
			});
		}
	});
});

// Implement GET method on /uvfit/
router.get("/", function (req, res, next) {
	UVFit.find({}, function (err, allData) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else {
			return res.status(200).json({ success: true, uvFitData: allData });
		}
	});
});

router.get("/:email", function (req, res, next) {
	UVFit.find({ email: req.params.email }, function (err, uvFit) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else {
			return res.status(200).json({ success: true, uvFitData: uvFit });
		}
	});
});

// Implement PUT method on /uvfit/
router.put("/update/:email", function (req, res, next) {
	UVFit.findOne({ email: req.params.email }, function (err, device) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else if (!device) {
			return res.status(400).json({ success: false, error: "No device for that email." });
		}
		else if (device) {
			if (req.body.deviceId) {
				bcrypt.hash(req.body.deviceId, null, null, function (err, hash) {
					if (err) {
						return res.status(500).json({ success: false, error: err.errmsg });
					}
					device.apiKey = hash;
					device.deviceId = req.body.deviceId;

					device.save(function (err, dev) {
						if (err) {
							return res.status(500).json({ success: false, error: err.errmsg });
						}
						else {
							return res.status(202).json({ success: true, apiKey: hash, deviceId: req.body.deviceId });
						}
					});
				});
			}
		}
	});
});

// TODO: Implement DELETE method on /uvfit/
router.delete("/delete/:email", function (req, res, next) {
	return res.status(501).json({ success: false, error: "UVFit DELETE endpoint not implemented." });
});

// Set up the export
module.exports = router;
