import BigNumber from 'bignumber.js';
const { FAUCET_RPC_URL, MTR_TOKEN_ADDRESS} = process.env;
const web3s = require('web3');
//FAUCET_RPC_URL = 'https://rpctest.meter.io for testnet OR https://rpc.meter.io for mainnet
const web3 = new web3s(new web3s.providers.HttpProvider(FAUCET_RPC_URL));
const er20ABI = require("./erc20.json");
const mtrTokenAddress = MTR_TOKEN_ADDRESS

class MTRBalanceService {

    public async getBalance (address:string) {
    let contract = new web3.eth.Contract(er20ABI)
    contract.options.address = mtrTokenAddress
    let balance = await contract.methods.balanceOf(address).call();
    const balanceToBN = new BigNumber(balance);
    const balanceDivDecimal = balanceToBN.div( new BigNumber(1).times(1e18))
    return balanceDivDecimal.toNumber();

    }
}



export default MTRBalanceService