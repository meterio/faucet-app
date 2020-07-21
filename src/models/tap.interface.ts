interface Tap {
  fromAddr: string;
  toAddr: string;
  value: string;
  token: string;
  txID: string;
  timestamp: number;
  ipAddr: string;
}

export default Tap;
