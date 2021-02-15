import * as mongoose from 'mongoose';
import Tap from './tap.interface';
const txSchema = new mongoose.Schema(
  {
    hash: { type: String, required: true },
    amount: { type: String, required: true }, // value in Wei
    token: { type: String, enum: ['MTR', 'MTRG'], required: true },
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

tapSchema.set('toJSON', {
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret._id;
  },
});

const tapModel = mongoose.model<Tap & mongoose.Document>('Tap', tapSchema);

export default tapModel;
