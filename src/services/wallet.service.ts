import {
  Framework,
  Driver,
  SimpleNet,
  SimpleWallet,
} from '@meterio/flex-framework';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { getNetworkBase } from '../const/rules';

const { FAUCET_ADDR, FAUCET_KEY, FAUCET_NETWORK } = process.env;

class WalletService {
  private wallet = new SimpleWallet();
  private driver?: Driver;
  private flex?: Framework;

  constructor() {
    // add account by importing private key
    this.wallet.import(FAUCET_KEY!);
    const base = getNetworkBase(FAUCET_NETWORK);
    if (!base) {
      throw new Error(`could not get network base for: ${FAUCET_NETWORK}`);
    }
    Driver.connect(new SimpleNet(base), this.wallet).then((driver: Driver) => {
      this.driver = driver;
      this.flex = new Framework(driver);

      // config tx parameters, e.g. expiration, gasPriceCoef
      this.driver.txParams.expiration = 18;
      this.driver.txParams.gasPriceCoef = 0;

      // watch committed tx
      this.driver.onTxCommit = (txObj: any) => {
        // do nothing
      };
    });
  }

  public async getBalance(addr: string): Promise<BigNumber> {
    try {
      const base = getNetworkBase(FAUCET_NETWORK);
      const url = `${base}/accounts/${addr}`;
      console.log('URL: ', url);
      const res = await axios.get(url);
      if (res.status !== 200) {
        return new BigNumber(-1);
      }
      const balance = new BigNumber(res.data.balance);
      const boundbalance = new BigNumber(res.data.boundbalance);
      console.log('BALANCE: ', balance.plus(boundbalance));
      return balance.plus(boundbalance);
    } catch (e) {
      console.log('Error Happened: ', e.message);
      return new BigNumber(-1);
    }
  }

  public async transferMTR(toAddr: string, amount: BigNumber) {
    if (!this.flex) {
      return undefined;
    }
    const signingService = this.flex.vendor.sign('tx');
    signingService
      .signer(FAUCET_ADDR!) // Enforce signer
      .gas(21000) // Set maximum gas
      .comment('faucet');

    console.log(
      `Transfer ${amount.dividedBy(1e18).toString()} MTR to ${toAddr}`
    );

    return signingService.request([
      { to: toAddr, value: amount.toFixed(), data: '0x', token: 0 },
    ]);
  }

  public async transferMTRG(toAddr: string, amount: BigNumber) {
    if (!this.flex) {
      return undefined;
    }
    const signingService = this.flex.vendor.sign('tx');

    signingService
      .signer(FAUCET_ADDR!) // Enforce signer
      .gas(21000) // Set maximum gas
      .comment('faucet');

    console.log(
      `Transfer ${amount.dividedBy(1e18).toString()} MTRG to ${toAddr}`
    );

    return signingService.request([
      { to: toAddr, value: amount.toFixed(), data: '0x', token: 1 },
    ]);
  }
}

export default WalletService;
