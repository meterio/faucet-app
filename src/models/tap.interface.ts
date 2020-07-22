interface Tap {
  fromAddr: string;
  toAddr: string;
  txs: Tx[];
  timestamp: number;
  ipAddr: string;
}

interface Tx {
  txID: string;
  value: string;
  token: string;
}

export default Tap;
