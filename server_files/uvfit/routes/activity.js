var express = require('express');
var router = express.Router();
var fs = require('fs');
var UVFitUser = require("../models/users");
var UVFit = require("../models/uvfit");
var Activity = require("../models/activity");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");

// Register a new activity, POST
router.post('/create', function (req, res, next) {
	return res.status(501).json({ success: false, error: "Activity POST endpoint not implemented." });
});

// Implement GET method on /uvfit/
router.get("/", function (req, res, next) {
	Activity.find({}, function (err, allActivities) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else {
			return res.status(200).json({ success: true, data: allActivities });
		}
	});
});

router.get("/:deviceId", function (req, res, next) {
	Activity.find({deviceId: req.params.deviceId}, function (err, allActivities) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else {
			return res.status(200).json({ success: true, data: allActivities });
		}
	});
});

router.get("/recent/:deviceId", function (req, res, next) {
	var today = new Date();
  var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

	Activity.find({deviceId: req.params.deviceId, activityStart: {$gte: lastWeek}}, function (err, allActivities) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else {
			return res.status(200).json({ success: true, data: allActivities });
		}
	});
});

// Implement PUT method on /activity/
router.put("/update/:id", function (req, res, next) {
	return res.status(501).json({ success: false, error: "Activity PUT endpoint not implemented." });
});

// TODO: Implement DELETE method on /activity/
router.delete("/delete/:email", function (req, res, next) {
	return res.status(501).json({ success: false, error: "Activity DELETE endpoint not implemented." });
});

// Set up the export
module.exports = router;
