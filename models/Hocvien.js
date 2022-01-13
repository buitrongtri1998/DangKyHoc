const mongoose = require("mongoose");
const hocvienSchema = new mongoose.Schema({
    Email: String,
    Hoten: String,
    SoDT: String,
    ThanhToan: Boolean,
    Vi: String,
    Ngay: Date
});

module.exports = mongoose.model("Hocvien", hocvienSchema);