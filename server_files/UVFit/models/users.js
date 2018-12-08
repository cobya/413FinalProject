var db = require("../db");

var uvFitUserSchema = new db.Schema({
	email: { type: String, required: true, unique: true },
	fullName: { type: String, required: true },
	passwordHash: { type: String, required: true },
	lastAccess: { type: Date, default: Date.now },
	exposureAlert: { type: Number, default: 1000 }
});

var UVFitUser = db.model("UVFitUser", uvFitUserSchema);

module.exports = UVFitUser;
