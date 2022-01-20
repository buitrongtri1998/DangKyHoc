const mongoose = require("mongoose");
const avtBackgroundSchema = new mongoose.Schema({
    imagesArrayBackground: String
});

module.exports = mongoose.model("avtBackground", avtBackgroundSchema);