var db = require("../db");

var uvFitSchema = new db.Schema({
	email: { type: String, required: true, unique: true },
	deviceId: { type: String, required: true },
	apiKey: { type: String, required: true }
});

var UVFit = db.model("UVFit", uvFitSchema);

module.exports = UVFit;
