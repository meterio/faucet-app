import {
  Framework,
  Driver,
  SimpleNet,
  SimpleWallet,
} from '@meterio/flex-framework';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { toASCII } from 'punycode';

const { FAUCET_ADDR, FAUCET_KEY, FAUCET_URL } = process.env;

class WalletService {
  private wallet = new SimpleWallet();
  private driver?: Driver;
  private flex?: Framework;

  constructor() {
    // add account by importing private key
    this.wallet.import(FAUCET_KEY!);

    Driver.connect(new SimpleNet(FAUCET_URL!), this.wallet).then(
      (driver: Driver) => {
        this.driver = driver;
        this.flex = new Framework(driver);

        // config tx parameters, e.g. expiration, gasPriceCoef
        this.driver.txParams.expiration = 18;
        this.driver.txParams.gasPriceCoef = 128;

        // watch committed tx
        this.driver.onTxCommit = (txObj: any) => {
          // do nothing
        };
      }
    );
  }

  public async getBalance(addr: string): Promise<number> {
    try {
      const url = FAUCET_URL + `accounts/${addr}`;
      const res = await axios.get(url);
      if (res.status !== 200) {
        return -1;
      }
      const balance = parseInt(res.data.balance, 16);
      return balance;
    } catch (e) {
      console.log('Error Happened: ', e.message);
      return -1;
    }
  }

  public async transferMTR(toAddr: string, amount: string) {
    if (!this.flex) {
      return undefined;
    }
    const signingService = this.flex.vendor.sign('tx');

    signingService
      .signer(FAUCET_ADDR!) // Enforce signer
      .gas(21000) // Set maximum gas
      .comment('faucet');

    const comment = `Transfer ${new BigNumber(amount)
      .dividedBy(1e18)
      .toString()} MTR`;

    console.log(`${comment} to ${toAddr}`);
    return signingService.request([
      {
        to: toAddr,
        value: amount,
        data: '0x',
        token: 0,
        comment,
      },
    ]);
  }

  public async transferMTRG(toAddr: string, amount: string) {
    if (!this.flex) {
      return undefined;
    }
    const signingService = this.flex.vendor.sign('tx');

    signingService
      .signer(FAUCET_ADDR!) // Enforce signer
      .gas(21000) // Set maximum gas
      .comment('faucet');

    const comment = `Transfer ${new BigNumber(amount)
      .dividedBy(1e18)
      .toString()} MTRG`;
    console.log(`${comment} ${amount}`);

    return signingService.request([
      {
        to: toAddr,
        value: amount,
        data: '0x',
        token: 1,
        comment,
      },
    ]);
  }
}

export default WalletService;
