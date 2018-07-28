$(function () {
    var userContract = web3.eth.contract(
        [
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "recordid",
                        "type": "uint256"
                    }
                ],
                "name": "getRecordDetail",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "recid",
                        "type": "uint256"
                    },
                    {
                        "name": "ipfs",
                        "type": "string"
                    }
                ],
                "name": "addRecord",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "x",
                        "type": "address"
                    }
                ],
                "name": "addPatient",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "x",
                        "type": "address"
                    }
                ],
                "name": "getUserType",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "to",
                        "type": "address"
                    }
                ],
                "name": "checkperm",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getDeployedElections",
                "outputs": [
                    {
                        "name": "",
                        "type": "address[]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "recid",
                        "type": "uint256"
                    }
                ],
                "name": "setPermission",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "x",
                        "type": "address"
                    }
                ],
                "name": "addHCP",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    );
    var user = userContract.at('0x1Df5843529Ca9986dEc8285b0F1ef1D783f2C0d6');
    console.log(user);
    
    $('#finishPatient').on('click', function (event) {
        var id = $(this).data('id');
        user.addPatient(id);
        console.log(user.getUserType(id,function(err,result){
            if (err){
                console.log (err);
            }
            else {
                console.log (result);
            }
        }));
    });   
});