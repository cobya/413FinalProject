var db = require("../db");

var activitySchema = new db.Schema({
	email: { type: String, required: true },
	activityId: { type: Number, required: true },
	activityDate: { type: Date, required: true },
	activityType: { type: String },
	caloriesBurned: { type: Number },
	duration: { type: Number }
});

var Activity = db.model("Activity", activitySchema);

module.exports = Activity;
