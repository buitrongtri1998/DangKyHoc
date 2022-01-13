
$(document).ready(function(){
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
    console.log(contract_MM);

    //create contract infira
    var provider = new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/aee14c6e7c4b489c8bbf980c45040555");
    var web3_infura = new Web3(provider);
    var contract_Infura = web3_infura.eth.Contract(abi, addressSM);
    console.log(contract_Infura);
    contract_Infura.events.SM_send_data({filter: {}, fromBlock: "latest"}, function(error, data){
        if(error){
            console.log(error);
        }else{
            $("#tbDS").append(`
                <tbody>
                    <tr>
                        <td scope="col">`+data.returnValues[0]+`</td>
                        <td scope="col">`+data.returnValues[1]+`</td>
                    </tr>
                <tbody>
            `);
        }
    });

    var currentAccount ="";
    checkMetaMask();
    
    $("#connectMM").click(function(){
        connectMM().then((data) => {
            currentAccount = data[0];
            console.log(currentAccount);
        }).catch((err) => {
            console.log(err);
        });
    })

    $("#btnDangKy").click(function(){
        if(currentAccount.length == 0){
            alert("Vui lòng đăng nhập metamask");
        }else{
            $.post("./dangky", {
                Email: $("#txtHoTen").val(),
                Hoten: $("#txtEmail").val(),
                SoDT: $("#txtSoDT").val()
            }, function(data){
                if(data.ketqua == 1){
                    contract_MM.methods.DangKy(data.maloi._id).send({
                        from: currentAccount,
                        value: 1000000000
                    });
                }
            });
        }
    });
});

async function connectMM(){
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
}

function checkMetaMask(){
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask đã được cài!');
    }else{
        console.log('Vui lòng cài MetaMask để tiếp tục!');
    }
}