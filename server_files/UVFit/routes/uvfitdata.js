var express = require('express');
var router = express.Router();
var fs = require('fs');
var UVFitData = require("../models/uvfitdata");
var UVFit = require("../models/uvfit");
var Activity = require("../models/activity");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");

// Insert new UV Fit data entries
router.post('/submit', function (req, res, next) {
	console.log(req.body)
	if (!req.body.hasOwnProperty("deviceId") || !req.body.hasOwnProperty("apiKey") || !req.body.hasOwnProperty("activityId") || !req.body.hasOwnProperty("gpsX") || !req.body.hasOwnProperty("gpsY") || !req.body.hasOwnProperty("measuredSpeed") || !req.body.hasOwnProperty("measuredUV")) {
		return res.status(400).json({ success: false, error: "Please enter all necessary parameters." });
	}

	// Validate deviceId exists
	UVFit.findOne({ deviceId: req.body.deviceId }, function (err, uvFit) {
		if (err) {
			return res.status(500).json({ success: false, error: "Error communicating with database." });
		}
		else if (!uvFit) {
			return res.status(400).json({ success: false, error: "There is no device associated with that deviceId." });
		}
		else {
			// make sure api keys match
			if (req.body.apiKey == uvFit.apiKey) {
				// create a new data entry and save it
				var newUVFitEntry;
				var dataTime
				if (req.body.hasOwnProperty("timeStamp")) {
					newUVFitEntry = new UVFitData({
						deviceId: req.body.deviceId,
						gpsLocationX: req.body.gpsX,
						gpsLocationY: req.body.gpsY,
						measuredSpeed: req.body.measuredSpeed,
						measuredUV: req.body.measuredUV,
						timeCollected: req.body.timeStamp,
						activityId: req.body.activityId
					});
					dataTime = req.body.timeStamp
				}
				else {
					newUVFitEntry = new UVFitData({
						deviceId: req.body.deviceId,
						gpsLocationX: req.body.gpsX,
						gpsLocationY: req.body.gpsY,
						measuredSpeed: req.body.measuredSpeed,
						measuredUV: req.body.measuredUV,
						activityId: req.body.activityId
					});
					dataTime = Date.now()
				}

				// make an activity entry if one does not exist, else update duration
				Activity.findOne({ deviceId: req.body.deviceId, activityId: req.body.activityId }, function (err, activity) {
					if (activity) {
						activity.duration = (dataTime - activity.activityStart) * (1.0/60000.0);
						activity.totalUV = activity.totalUV + req.body.measuredUV;
						if (req.body.measuredSpeed < 5.0) {
							activity.activityType = "Walking";
							activity.caloriesBurned = activity.duration * 7.6;
						} else if (req.body.measuredSpeed >= 5.0 && req.body.measuredSpeed <= 10.0) {
							activity.activityType = "Running";
							activity.caloriesBurned = activity.duration * 13.2;
						} else {
							activity.activityType = "Biking";
							activity.caloriesBurned = activity.duration * 9.0;
						}

						activity.save();
					} else {
						var newActivity = new Activity({
							deviceId: req.body.deviceId,
							activityId: req.body.activityId,
							duration: 0.0,
							activityStart: dataTime,
							caloriesBurned: 0.0,
							activityType: "Walking",
							totalUV: req.body.measuredUV
						});

						newActivity.save();
					}
				});

				newUVFitEntry.save(function (err, user) {
					if (err) {
						return res.status(400).json({ success: false, error: err.errmsg });
					}
					else {
						return res.status(201).json({ success: true, message: "Data submitted successfully." })
					}
				});
			} else {
				// Error can occur if a duplicate email is sent
				return res.status(400).json({ success: false, error: "Invalid API key submitted." });
			}
		}
	});
});

// Implement GET method on /uvfitdata/
router.get("/", function (req, res, next) {
	UVFitData.find({}, function (err, allData) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else {
			return res.status(200).json({ success: true, submittedData: allData });
		}
	});
});

router.get("/:deviceId", function (req, res, next) {
	UVFitData.find({ deviceId: req.params.deviceId }, function (err, deviceData) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else {
			return res.status(200).json({ success: true, submittedData: deviceData });
		}
	});
});

router.get("/:deviceId/:activityId", function (req, res, next) {
	UVFitData.find({ deviceId: req.params.deviceId, activityId: req.params.activityId }, function (err, deviceData) {
		if (err) {
			return res.status(500).json({ success: false, error: err.errmsg });
		}
		else {
			return res.status(200).json({ success: true, submittedData: deviceData });
		}
	});
});

// TODO: Implement PUT method on /uvfitdata/
router.put("/update/:deviceId", function (req, res, next) {
	return res.status(501).json({ success: false, error: "UVFitData PUT endpoint not implemented." });
});

// TODO: Implement DELETE method on /uvfitdata/
router.delete("/delete/:deviceId", function (req, res, next) {
	return res.status(501).json({ success: false, error: "UVFitData DELETE endpoint not implemented." });
});

module.exports = router;
