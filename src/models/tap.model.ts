import * as mongoose from 'mongoose';
import Tap from './tap.interface';
import { SYSTEM_COIN, SYSTEM_TOKEN } from 'const/config';
const txSchema = new mongoose.Schema<Tap>(
  {
    hash: { type: String, required: true },
    amount: { type: String, required: true }, // value in Wei
    token: { type: String, enum: [SYSTEM_COIN, SYSTEM_TOKEN], required: true },
  },
  { _id: false }
);

const tapSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  txs: { type: [txSchema], required: true },
  timestamp: { type: Number },
  ipAddr: { type: String, required: true },
});

const tapModel = mongoose.model<Tap & mongoose.Document>('Tap', tapSchema);

export default tapModel;
