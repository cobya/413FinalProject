var express = require('express');
var router = express.Router();
var fs = require('fs');
var UVFitData = require("../models/uvfitdata");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");

// Insert new UV Fit data entries
router.post('/', function (req, res, next) {
	res.status(501).json({ success: false, message: "UVFitData POST endpoint not implemented." });
});

// TODO: Implement GET method on /uvfitdata/
router.get("/", function (req, res, next) {
	res.status(501).json({ success: false, message: "UVFitData GET endpoint not implemented." });
});

router.get("/:id", function (req, res, next) {
	res.status(501).json({ success: false, message: "UVFitData ID GET endpoint not implemented." });
});

// TODO: Implement PUT method on /uvfitdata/
router.put("/:id", function (req, res, next) {
	res.status(501).json({ success: false, message: "UVFitData PUT endpoint not implemented." });
});

// TODO: Implement DELETE method on /uvfitdata/
router.delete("/:id", function (req, res, next) {
	res.status(501).json({ success: false, message: "UVFitData DELETE endpoint not implemented." });
});

module.exports = router;
