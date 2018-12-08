var db = require("../db");

var activitySchema = new db.Schema({
	deviceId: { type: String, required: true },
	activityId: { type: Number, required: true },
	activityStart: { type: Date, required: true },
	activityType: { type: String },
	caloriesBurned: { type: Number },
	duration: { type: Number }
});

var Activity = db.model("Activity", activitySchema);

module.exports = Activity;
