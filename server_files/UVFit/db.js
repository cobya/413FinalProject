var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://web:O3kZ9vNMVn3f3vm5@finalproject-jbdgc.mongodb.net/uvfit?retryWrites=true", { useNewUrlParser: true });
module.exports = mongoose;
