var Hocvien = require("../models/Hocvien");

module.exports = function(app){

    app.get("/", function(req, res){
        res.render("layout");
    })

    app.post("/dangky", function(req, res){
        if(!req.body.Email || !req.body.Hoten || !req.body.SoDT){
            res.json({
                ketqua: 0,
                maloi: "Thieu tham so nhap vao"
            });
        }else{
            var hocVienMoi = new Hocvien({
                Email: req.body.Email,
                Hoten: req.body.Hoten,
                SoDT: req.body.SoDT,
                ThanhToan: false,
                Vi: "",
                Ngay: Date.now()
            });
            hocVienMoi.save(function(err){
                if(err){
                    res.json({
                        ketqua: 0,
                        maloi: "MongooDb save error"
                    });
                }else{
                    res.json({
                        ketqua: 1,
                        maloi: hocVienMoi
                    });
                }
            });
        }
    })
}