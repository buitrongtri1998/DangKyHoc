var srcBackground = "https://lh3.googleusercontent.com/pw/AM-JKLUdJqkAwZ9KNhnEG5Ka9w3rT-hKPE9ZiATpn9VcABWSEFyvQcjzqTaQkphuntVvpfKkWqt3ENq491zr0hjkBpQ2yn44ih4fEja-YLXlitYlYUsVx1R5J1KvnWviJF-cFnql21JphcF8Y2-JFsvJJMX9=s500-no?authuser=0";
var srcHead = "https://lh3.googleusercontent.com/pw/AM-JKLWD9WPOSj39d9lbYAb48jBrtvjzT1Fk0KPe80KbyPawVpIAADB4krppX-bOGVJYGu6u85PFvMIu0rbSVQ0hOi8MXdwLzNpBHUxpEesfPqxZrZW9Dhut7D9HtiIDpWu-mzIB1rnB60-eMEmvVNF7d5SO=s500-no?authuser=0";
var srcBody = "https://lh3.googleusercontent.com/pw/AM-JKLW3pgVOp6txNRQBSSWrHAeTCjAESp-_CHOTmaFdafXi5jsouDu4mNrB4yJ4-pXhWwzCOJV_W0HvLsjgPR5cCfVHCYfIMkvrtKOGAbC8u0BPz1zN_51kXszDMKskkesDWLEpfyReiGYUSyakM67iJJhR=s500-no?authuser=0";
/*-----------------------------------------------------------------------------------------------------------------------*/
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
    checkMetaMask();

    $("#connectMM").click(function () {
        connectMM().then((data) => {
            currentAccount = data[0];
            console.log(currentAccount);
        }).catch((err) => {
            console.log(err);
        });
    })

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
    
    $("#btnRanImg").click(function () {
        srcBackground = "";
        srcHead = "";
        srcBody = "";
        avtBackground();
        avtHead();
        avtBody();
    });

});

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



function avtBackground() {
    var imagesArrayBackground = new Array();
    imagesArrayBackground = [
       "https://lh3.googleusercontent.com/pw/AM-JKLUTWVAoSyZDkkVYL-68C7_zf-iFbYbT_OGurSG6Rs4r1a_myWk32osdafuuzWWL0BrJFSGLWDwMP0-qPegVIrqabn73Z5gXRP2-lAJ6ZtfdkugOA17BxjXADoqnAV0kyAERBiXlAJ3PkKhFJWGq4t1h=s500-no?authuser=0",
       "https://lh3.googleusercontent.com/pw/AM-JKLX2_1bWHMKUTBavIQ54yUTrR7Ptwgz4zLGflI3uBDjLGJUlq2zowxS5xUcycLWE_YmokjMrXaIJPGL1PZpPWFHJAjWh1Q_5uB8qaw6Wo1zuVAOlyO9htHKJmvyw5AJcHJ9j3ffpoG2vd5v3i8zgvMAD=s500-no?authuser=0",
       "https://lh3.googleusercontent.com/pw/AM-JKLUKjy4JjKkrRvZ2r1dj2M1hoBi1SVqS5N8CAixYczBKdaV4XphgJZEmO4mKgxane33sI4ngRVp_yM36M9uAKHlNPF0T_kL2ay1egX8XP0JnmmV6FRPxvWtTRmiu3dXhQgjjgPygXCY6rttlZl3-oVAa=s500-no?authuser=0",
       "https://lh3.googleusercontent.com/pw/AM-JKLU5NxKEJQmEehxmaaPD6wUZZFe_iGO5b7rGn8P9hk1MGzEq4KBADr1FnAuVZZENCbLmGz8uvw0E4czF8YsDqGeIwBdr3TsGmzVxiJrD4tAsFnOEcyaQIEwgVjpVKNIq3vPWVqh1MGdVgxYgKyS85Plx=s500-no?authuser=0",
       "https://lh3.googleusercontent.com/pw/AM-JKLViXbpWMao17vRDR8TbiPavpr1u4ZJZeO3AEenDthEJB5vjtEtF86y0mmiWKQtYE_00KwhK4AWgoLkJmQC-du_7Kc2wYNB8ubFG1R46ZfFbSgxwN2qRwd4i7R-VrkYc-9psMwDPNOcnWkZzX0zhEYbL=s500-no?authuser=0",
       "https://lh3.googleusercontent.com/pw/AM-JKLXqytu2gKiYEbzyGWqAi0bkd2tH_RPVQHhlSEfSjw4h6oOzHHR9WgIZYQny36YXcoO-g6wJxp9YHHt-CGL_fIBXFFQHVDgELI2r4eDOEcO8bPI-7XBBrCLvQ5HzgWvAG8emtx62Kyd7Wt1sQ5hPqGlK=s500-no?authuser=0",
       "https://lh3.googleusercontent.com/pw/AM-JKLXl0Bup9Qh5fN6Tl5iBMAI22heukGjWQW0EZ_00BqHv950rdDc_xmwDH5IkMV0WvOEa0TeYE_UOQLbtRPMPZRtpuoWKz4Z3rBmBmgobTXxkKtmv26_ur08O76QEVaLC69SHJJS6TKe4jS400FWf5V-b=s500-no?authuser=0",
       "https://lh3.googleusercontent.com/pw/AM-JKLV47Atkd0-wGWNyqGxq4HNofCLpLQvTwTxYkoIL_DLQARDwuEySZ5go581Q92FT4v6KnIfUwcpjoteFLPMssU8oC9Pb4L6dyVA5-cqA0eyVhTFP6Pckvf6A3cbkYMW1kURSf323cx5LRWYox7YlhZoG=s500-no?authuser=0",
       "https://lh3.googleusercontent.com/pw/AM-JKLUdJqkAwZ9KNhnEG5Ka9w3rT-hKPE9ZiATpn9VcABWSEFyvQcjzqTaQkphuntVvpfKkWqt3ENq491zr0hjkBpQ2yn44ih4fEja-YLXlitYlYUsVx1R5J1KvnWviJF-cFnql21JphcF8Y2-JFsvJJMX9=s500-no?authuser=0"
    ]
    var num = Math.floor(Math.random() * imagesArrayBackground.length);
    var img = imagesArrayBackground[num];

    $("#imgRanBackground").attr('src',img);
    srcBackground = img;
}


function avtHead() {
    var imagesArrayHead = new Array();
    imagesArrayHead = [
        "https://lh3.googleusercontent.com/pw/AM-JKLWD9WPOSj39d9lbYAb48jBrtvjzT1Fk0KPe80KbyPawVpIAADB4krppX-bOGVJYGu6u85PFvMIu0rbSVQ0hOi8MXdwLzNpBHUxpEesfPqxZrZW9Dhut7D9HtiIDpWu-mzIB1rnB60-eMEmvVNF7d5SO=s500-no?authuser=0",
        "https://lh3.googleusercontent.com/pw/AM-JKLV3q0vH08aYuSHQ9GMiM3rEuqs8xzgZZ4Qav3tYj5faxXSmRi1K223xqaK_Bw21uOTA1oDPy8gHldCvg4rorN3FTVelX_D1ZS6EmEIk_MlKZu4rkvKrxYkQJLdbxIo7k_2ZkEQJnyE3CpCTLUqKF0C4=s500-no?authuser=0",
        "https://lh3.googleusercontent.com/pw/AM-JKLV_OGh3NFH2mtDYgo4wEqTPZg1hub_cLCX25ccRvKbkT15Q8dVexD_NHg6oxniG157pdEYxqJncNtB8LzgRvsPY_CrBeN-b1pucaYyfIOaX_baP6L9_ijjlOi_c44iRemISU45K9oD-_zpjQ0rHtoAW=s500-no?authuser=0",
        "https://lh3.googleusercontent.com/pw/AM-JKLUa7WMRTkyHr8N1lPszh7Ti7Xq5uUinrrZblGXLJyn3s4bK90C_0wL5xHQ42XVXA7qx2iVQSBal-k5qx5ED9YVQPvHeKhj8Vlve5hmErC3NAyv6nA7QAHIKTzaWVkJpx0WosYHXD1_-MSEQca8v-dQx=s500-no?authuser=0",
        "https://lh3.googleusercontent.com/pw/AM-JKLXnOgt33eAx_wv5mVxrCh9RYTdcNAE7Fe5FmoN9B_y9hkTHO_I9-XIeAlHXIUixGnq_lw85qNPUswsGfqoloM7-JwQqcUVjjhlA3Zy5CV-ZuODSWOGJGWE3Gz9sqK2cfRBgT3d4lQsEhmCU_9pfqyYZ=s500-no?authuser=0"
    ]

    var num = Math.floor(Math.random() * imagesArrayHead.length);
    var img = imagesArrayHead[num];

    $("#imgRanHead").attr('src',img);
    srcHead = img
}

function avtBody() {
    var imagesArrayBody = new Array();
    imagesArrayBody = [
        "https://lh3.googleusercontent.com/pw/AM-JKLVDf3XhrOXMwLF02TzZ14spYvdYN2uh1JPsaFtRwlFkQFsixUhwLed5GsFrULc3PDymPwGB08nIOS3m1Hn5GzEVFgx2BdI_mJ1RytMQwwklj2nN3hEqCRqKaCRFHILYyS-oiNuFXTLtrO3o2N8m9UzT=s500-no?authuser=0",
        "https://lh3.googleusercontent.com/pw/AM-JKLXgEhgTKp_5461pSl6lU4iokJfej5hoXuDc3Iyk8aPyf3HGO790ocNrr_oJdm2JMz59u5MFISnoG58mBsdR1Z8HiOnF5qnX8CZhHUCixUT5YBklggrnpvEjBCCk9DoaZGL2sTjHDkj0t7KdcVhQZS-7=s500-no?authuser=0",
        "https://lh3.googleusercontent.com/pw/AM-JKLWHbMVy1lTBTPyFaqAfCxo_QBR-yJg7fTD879d0xAkplJCMUT6pgsDQtg2jHT-HPR_EePiO8AbWcEUe1FspEMMEE_lNzblNdTAoJin3IKDIPSd6WksPHTjazHnq7MzdFeM5mRoim3mtSaqubJbCSUZ1=s500-no?authuser=0",
        "https://lh3.googleusercontent.com/pw/AM-JKLW3pgVOp6txNRQBSSWrHAeTCjAESp-_CHOTmaFdafXi5jsouDu4mNrB4yJ4-pXhWwzCOJV_W0HvLsjgPR5cCfVHCYfIMkvrtKOGAbC8u0BPz1zN_51kXszDMKskkesDWLEpfyReiGYUSyakM67iJJhR=s500-no?authuser=0",
        "https://lh3.googleusercontent.com/pw/AM-JKLXXG2BWc2hoN9HvqG36JVeIz5YeczKX-07baMSgfi1LYjtvALA0xgXx7RmXvRPxQEZuAhZ7y7v7IZqSOLL-dZUbN2VGNKGUIeuOixKgnRFD_eqkdWRQ3LDw_uj6Ry7XitDYBMDq5LMvIPOZuwB7fLwe=s500-no?authuser=0"
    ]

    var num = Math.floor(Math.random() * imagesArrayBody.length);
    var img = imagesArrayBody[num];

    $("#imgRanBody").attr('src',img);
    srcBody = img;
}


