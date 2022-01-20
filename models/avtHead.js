const mongoose = require("mongoose");
const avtHeadSchema = new mongoose.Schema({
    imagesArrayHead: String
});

module.exports = mongoose.model("avtHead", avtHeadSchema);