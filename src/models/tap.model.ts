import * as mongoose from 'mongoose';
import Tap from './tap.interface';

const tapSchema = new mongoose.Schema({
  fromAddr: { type: String, required: true },
  toAddr: { type: String, required: true },
  value: { type: String, required: true }, // value in Wei
  token: { type: String, enum: ['MTR', 'MTRG'] },
  txID: { type: String, required: true },
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
