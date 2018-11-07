var db = require("../db");

var uvFitSchema = new db.Schema({
	email: { type: String, required: true, unique: true },
	deviceId: { type: String, required: false },
	apiKey: { type: String, required: false }
});

var UVFit = db.model("UVFit", uvFitSchema);

module.exports = UVFit;
