import web3 from './web3';
import Record from './build/Record.json';

const instance = new web3.eth.Contract(
    JSON.parse(Record.interface),
    '0xd535d7D49eAC07e83b360E5D67EB1353E34b9720'
);

export default instance;