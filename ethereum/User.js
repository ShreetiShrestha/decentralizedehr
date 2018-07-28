import web3 from './web3';
import User from './build/User.json';

const instance = new web3.eth.Contract(
    JSON.parse(User.interface),
    '0x8566665895726C802b744aAce91BC7d8B21bb20A'
);

export default instance;