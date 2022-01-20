var imagesArrayHead = [];
var imagesArrayBackground = [];
var imagesArrayBody = [];

var srcBackground = "";
var srcHead = "";
var srcBody = "";

/*-----------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function () {

    const abi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_vi",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "_id",
                    "type": "string"
                }
            ],
            "name": "SM_send_data",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_id",
                    "type": "string"
                }
            ],
            "name": "DangKy",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "arrHocvien",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "_ID",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "_VI",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const addressSM = "0x825F8127E4e65e286AE01B527E407bB57a6b450a";

    const web3 = new Web3(window.ethereum);
    window.ethereum.enable();

    //Create contract Metamask
    var contract_MM = new web3.eth.Contract(abi, addressSM);

    //create contract infura
    var provider = new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/aee14c6e7c4b489c8bbf980c45040555");
    var web3_infura = new Web3(provider);
    var contract_Infura = web3_infura.eth.Contract(abi, addressSM);

    //nhan kq khi luu vao smart contract va chay api dong tien de thay doi ThanhToan = true
    //sau do hien thi thong tin va avt cua hoc sinh vua dki thanh cong
    contract_Infura.events.SM_send_data({ filter: {}, fromBlock: "latest" }, function (error, data) {
        if (error) {
            console.log(error);
        } else {
            $.post("./dongtien", {
                id: data.returnValues[1],
                Vi: data.returnValues[0],
            }, function (data) {
                $("#danhsach").append(`
                    <div class="card-deck col-md-3" style = 'margin: 10px 0 0 0; height: 350px;'>
                        <div class="card bg-light" style = 'width: 100%; height: 100%'>
                            <div class="parent">
                                <img class="image1" src="`+data.data.srcBackground+`" alt="">
                                <img class="image2" src="`+data.data.srcHead+`" alt="">
                                <img class="image2" src="`+data.data.srcBody+`" alt="">
                            </div>
                            <div class="card-header" style = 'width: 100%; height: 150px'>
                                ` + "Họ tên: " + data.data.Hoten + '<br>' + "SĐT: " + data.data.SoDT + '<br>' + "Email: " + data.data.Email + `
                            </div>
                        </div>
                    </div>
                `);
            });
        }
    });

    var currentAccount = "";
    checkMetaMask();    //check metamask dc cai chua?
    loadListStudent();  //load danh sach hoc sinh (dk: thanh toan = true) tu csdl
    loadBackground();   
    loadHead();
    loadBody();

    //click button connect metamask
    $("#connectMM").click(function () {
        connectMM().then((data) => {
            currentAccount = data[0];
            console.log(currentAccount);
        }).catch((err) => {
            console.log(err);
        });
    })

    //click dang ky
    $("#btnDangKy").click(function () {
        if (currentAccount.length == 0) {          
            alert("Vui lòng đăng nhập metamask");
        } else {
            $.post("./dangky", {                    
                Email: $("#txtEmail").val(),       
                Hoten: $("#txtHoTen").val(),        
                SoDT: $("#txtSoDT").val(),
                srcBackground: srcBackground,      
                srcHead: srcHead,                  
                srcBody: srcBody                    
            }, function (data) {                    
                if (data.ketqua == 1) {            
                    contract_MM.methods.DangKy(data.maloi._id).send({       
                        from: currentAccount,                               
                        value: 1000000000
                    });
                }
            });
        }
    });

    //click button background(custom)
    $("#btnBackground").click(function() {
        $(".listBackground").hide();     
        $(".listHead").hide();            
        $(".listBody").hide();
        loadElementBackground();               
    })

    //click button head(custom)
    $("#btnHead").click(function() {      
        $(".listBackground").hide();       
        $(".listHead").hide();
        $(".listBody").hide();
        loadElementHead();                       
    });

    //click button body(custom)
    $("#btnBody").click(function() {
        $(".listBackground").hide();      
        $(".listHead").hide();
        $(".listBody").hide();
        loadElementBody();                       
    });

    //click button Random avt
    $("#btnRandomAvt").click(function () {
        avtBackground();     
        avtHead();           
        avtBody();           
    });

});

/*--------------------------------------------MetaMask-------------------------------------------------------------------- */
async function connectMM() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
}

function checkMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask đã được cài!');
    } else {
        console.log('Vui lòng cài MetaMask để tiếp tục!');
    }
}

/*--------------------------------------------Load Web-------------------------------------------------------------------- */
function loadListStudent(){                                             
    window.fetch("http://localhost:3000/danhsachhs")                   
    .then(function (res) {
        if (!res.ok) { throw new Error("Lỗi = " + res.status); }
        return res.json();
    })
    .then(function (data) {
        data.data.forEach(function (element) {
            $("#danhsach").append(`
                    <div class="card-deck col-md-3" style = 'margin: 10px 0 0 0; height: 350px;'>
                        <div class="card bg-light" style = 'width: 100%; height: 100%'>
                            <div class="card-body">
                                <div class="parent">
                                    <img class="image1" src="`+element.srcBackground+`" alt="">
                                    <img class="image2" src="`+element.srcHead+`" alt="">
                                    <img class="image2" src="`+element.srcBody+`" alt="">
                                </div>
                            </div>
                            <div class="card-header" style = 'width: 100%; height: 150px'>
                                ` + "Họ tên: " + element.Hoten + '<br>' + "SĐT: " + element.SoDT + '<br>' + "Email: " + element.Email + `
                            </div>
                        </div>
                    </div>
            `);
        });
    })
    .catch(function (error) {
        console.log("Lỗi: ", error);
    })
}

function loadBackground(){
    imagesArrayBackground = [];
    window.fetch("http://localhost:3000/danhsachavtbackground")       
    .then(function (res) {
        if (!res.ok) { throw new Error("Lỗi = " + res.status); }
        return res.json();
    })
    .then(function (data) {
        data.data.forEach(function (element) {
            imagesArrayBackground.push(element.imagesArrayBackground);
        });
        $("#imgRanDefaul").append(`
            <img class="image1" id="imgRanBackground" width="100%" height="100%" src="`+imagesArrayBackground[0]+`">
        `)
        srcBackground = imagesArrayBackground[0];
        for(var i = 0; i < imagesArrayBackground.length; i++){
            $("#listPic").append(`
                    <div id="customBackground`+i+`" class="col-4 listBackground" style = 'margin: 10px 0 0 0' onclick = "appendCheckboxBackground(id);">
                        <a  class = "custom" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" >
                            <img  src="`+imagesArrayBackground[i]+`" style = 'width: 100%; height: 100%' onclick="clickCustomBackground(src);">
                        </a>
                    </div>
            `);
        }
    })
    .catch(function (error) {
        console.log("Lỗi: ", error);
    })
}

function loadHead() {            
    imagesArrayHead = [];
    window.fetch("http://localhost:3000/danhsachavthead")       
    .then(function (res) {
        if (!res.ok) { throw new Error("Lỗi = " + res.status); }
        return res.json();
    })
    .then(function (data) {
        data.data.forEach(function (element) {
            imagesArrayHead.push(element.imagesArrayHead);
        });
        $("#imgRanDefaul").append(`
            <img class="image2" id="imgRanHead" width="100%" height="100%" src="`+imagesArrayHead[0]+`">
        `)
        srcHead = imagesArrayHead[0];
    })
    .catch(function (error) {
        console.log("Lỗi: ", error);
    })                                                
}

function loadBody() {
    imagesArrayBody = [];
    window.fetch("http://localhost:3000/danhsachavtbody")       
    .then(function (res) {
        if (!res.ok) { throw new Error("Lỗi = " + res.status); }
        return res.json();
    })
    .then(function (data) {
        data.data.forEach(function (element) {
            imagesArrayBody.push(element.imagesArrayBody);
        });
        $("#imgRanDefaul").append(`
            <img class="image3" id="imgRanBody" width="100%" height="100%" src="`+imagesArrayBody[0]+`">
        `)
        srcBody = imagesArrayBody[0];
    })
    .catch(function (error) {
        console.log("Lỗi: ", error);
    }) 
}

/*--------------------------------------------Click button custom avt-------------------------------------------------------------------- */

function loadElementBackground(){
    imagesArrayBackground = [];
    window.fetch("http://localhost:3000/danhsachavtbackground")       
    .then(function (res) {
        if (!res.ok) { throw new Error("Lỗi = " + res.status); }
        return res.json();
    })
    .then(function (data) {
        data.data.forEach(function (element) {
            imagesArrayBackground.push(element.imagesArrayBackground);
        });
        for(var i = 0; i < imagesArrayBackground.length; i++){
            $("#listPic").append(`
                    <div id="customBackground`+i+`" class="col-4 listBackground" style = 'margin: 10px 0 0 0' onclick = "appendCheckboxBackground(id);">
                        <a  class = "custom" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" >
                            <img  src="`+imagesArrayBackground[i]+`" style = 'width: 100%; height: 100%' onclick="clickCustomBackground(src);">
                        </a>
                    </div>
            `);
        }
    })
    .catch(function (error) {
        console.log("Lỗi: ", error);
    })
}

function loadElementHead() {            
    imagesArrayHead = [];
    window.fetch("http://localhost:3000/danhsachavthead")       
    .then(function (res) {
        if (!res.ok) { throw new Error("Lỗi = " + res.status); }
        return res.json();
    })
    .then(function (data) {
        data.data.forEach(function (element) {
            imagesArrayHead.push(element.imagesArrayHead);
        });
        for(var i = 0; i < imagesArrayHead.length; i++){                          
            $("#listPic").append(`
                <div id="customHead`+i+`" class="col-4 listHead" style = 'margin: 10px 0 0 0' onclick="appendCheckboxHead(id)">
                    <a  class = "custom" tabindex="0" role="button" data-toggle="popover" data-trigger="focus">
                        <img src="`+imagesArrayHead[i]+`" style = 'width: 100%; height: 100%' onclick="clickCustomHead(src)">
                    </a>
                </div>
            `);
        }
    })
    .catch(function (error) {
        console.log("Lỗi: ", error);
    })                                                
}

function loadElementBody() {     
    imagesArrayBody = [];
    window.fetch("http://localhost:3000/danhsachavtbody")       
    .then(function (res) {
        if (!res.ok) { throw new Error("Lỗi = " + res.status); }
        return res.json();
    })
    .then(function (data) {
        data.data.forEach(function (element) {
            imagesArrayBody.push(element.imagesArrayBody);
        });
        for(var i = 0; i < imagesArrayBody.length; i++){                              
            $("#listPic").append(`
                <div id="customBody`+i+`" class="col-4 listBody" style = 'margin: 10px 0 0 0' onclick="appendCheckboxBody(id);">
                    <a class = "custom" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" >
                        <img src="`+imagesArrayBody[i]+`" style = 'width: 100%; height: 100%' onclick="clickCustomBody(src)">
                    </a>
                </div>
            `);
        }
    })
    .catch(function (error) {
        console.log("Lỗi: ", error);
    })                                                   
    
}

/*--------------------------------------------Custom avt-------------------------------------------------------------------- */
function clickCustomBackground(src) {
    $("#imgRanBackground").attr('src', src)
    srcBackground = src;
}

function clickCustomHead(src) {
    $("#imgRanHead").attr('src', src)
    srcHead = src;
}

function clickCustomBody(src) {
    $("#imgRanBody").attr('src', src)
    srcBody = src;
}

/*--------------------------------------------Checkbox Custom avt-------------------------------------------------------------------- */
function appendCheckboxHead(id) {
    $(".checkboxHead").hide();
    $("#"+id).append(`
        <input type="checkbox" class="checkboxHead" checked></input>
    `)
}

function appendCheckboxBody(id) {
    $(".checkboxBody").hide();
    $("#"+id).append(`
        <input type="checkbox" class="checkboxBody" checked></input>
    `)
}

function appendCheckboxBackground(id) {
    $(".checkboxBackground").hide();
    $("#"+id).append(`
        <input type="checkbox" class="checkboxBackground" checked></input>
    `)
}

/*--------------------------------------------RanDom Avt-------------------------------------------------------------------- */
function avtBackground() {
    var num = Math.floor(Math.random() * imagesArrayBackground.length);
    var img = imagesArrayBackground[num];
    $("#imgRanBackground").attr('src',img);
    srcBackground = img;
}

function avtHead() {
    var num = Math.floor(Math.random() * imagesArrayHead.length);
    var img = imagesArrayHead[num];
    $("#imgRanHead").attr('src',img);
    srcHead = img;
}

function avtBody() {
    var num = Math.floor(Math.random() * imagesArrayBody.length);
    var img = imagesArrayBody[num];
    $("#imgRanBody").attr('src',img);
    srcBody = img;
}


