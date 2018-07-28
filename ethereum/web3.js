var Web3 = require('web3');


let web3;
// var window= Web3.window;
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    console.log('you have metamask');
    web3 = new Web3(window.web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/F7F0FVQU2NvNwqRLrwHn'));
    console.log('No web3? You should consider trying MetaMask!');
}

exports.web3 = web3;