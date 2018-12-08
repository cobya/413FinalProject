var db = require("../db");

var uvFitDataSchema = new db.Schema({
	deviceId: { type: String, required: true },
	gpsLocationX: { type: Number, required: true },
	gpsLocationY: { type: Number, required: true },
	measuredSpeed: { type: Number, required: true },
	measuredUV: { type: Number, required: true },
	timeCollected: { type: Date, default: Date.now },
	activityId: { type: Number, required: true }
});

var UVFitDataEntry = db.model("UVFitDataEntry", uvFitDataSchema);

module.exports = UVFitDataEntry;
