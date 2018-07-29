const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledUser = require('./build/User.json');
const compiledRecord = require('./build/Record.json');

const provider = new HDWalletProvider(
'apart bundle waste cook winter surround cart fence bundle merry law book','https://rinkeby.infura.io/F7F0FVQU2NvNwqRLrwHn'
);

const web3 = new Web3(provider);

const deploy= async() => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    
    const resultUser = await new web3.eth.Contract(JSON.parse(compiledUser.interface)).deploy({data:'0x' + compiledUser.bytecode}).send({gas: '1000000', from: accounts[0]});
    console.log('User Contract deployed to', resultUser.options.address);

    const result = await new web3.eth.Contract(JSON.parse(compiledRecord.interface)).deploy({data:'0x' + compiledRecord.bytecode}).send({gas: '1000000', from: accounts[0]});
    console.log('Record Contract deployed to', result.options.address);
};
deploy();
