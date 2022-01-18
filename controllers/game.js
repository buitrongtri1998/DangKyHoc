var Hocvien = require("../models/Hocvien");

module.exports = function(app){

    app.get("/", function(req, res){
        res.render("layout");
    })

    //đăng ký học
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
                Ngay: Date.now(),
                srcBackground: req.body.srcBackground,
                srcHead: req.body.srcHead,
                srcBody: req.body.srcBody
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

    //update đã thanh toán + địa chỉ ví sau khi đóng tiền sau đó gửi thông tin(họ tên, email...) ngược lại
    app.post("/dongtien", function(req, res, next){
        Hocvien.updateOne({_id: req.body.id},
            {
                    $set:{
                        ThanhToan: true,
                        Vi: req.body.Vi
                    }
            },  function(err){ 
                    if(err) console.log(err)
                    Hocvien.findById({_id: req.body.id}, function(err, data){
                        if(err){
                            console.log(err);
                        }else{
                            res.send({data});
                        }
                    })
        })
    })

    //lấy tất cả học sinh đã đóng học phí 
    app.get('/danhsachhs', (req, res) => {
        Hocvien.find({ThanhToan: true}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.send({data});
            }
        })
    });
    
    //lấy học sinh theo id
    app.get('/getById', (req, res) => {
        var id = req.body.id;
        Hocvien.findById({_id: id}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.send({data});
            }
        })
    });
}