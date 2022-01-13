var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/scripts", express.static(__dirname+"/node_modules/web3.js-browser/build/"));

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://minigame:4DvvFkhqUW97poVh@cluster0.napeu.mongodb.net/minigame?retryWrites=true&w=majority', function(err){
    if(err){
        console.log("Mongodb connect err!" + err);
    }else{
        console.log("MongoDB connect successfully!")
    }
});



require("./controllers/game")(app);