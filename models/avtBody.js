const mongoose = require("mongoose");
const avtBodySchema = new mongoose.Schema({
    imagesArrayBody: String
});

module.exports = mongoose.model("avtBody", avtBodySchema);