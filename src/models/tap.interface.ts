interface Tap {
  from: string;
  to: string;
  txs: Tx[];
  timestamp: number;
  ipAddr: string;
}

interface Tx {
  hash: string;
  amount: string;
  token: string;
}

export default Tap;
