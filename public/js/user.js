var userContract = web3.eth.contract(
    [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "dr",
                    "type": "address"
                }
            ],
            "name": "addHCP",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "addPatient",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
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
            "constant": true,
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
            "constant": true,
            "inputs": [],
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
        }
    ]
);
var user = userContract.at('0x6a41505fa9fdc3d16c8ceefcb9eb46f6150aa713');
console.log(user);