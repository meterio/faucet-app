import tapModel from '../models/tap.model';
import Tap from '../models/tap.interface';

class TapRepo {
  private tap = tapModel;

  public async findAll() {
    return this.tap.find();
  }

  public async findByTo(toAddr: string) {
    return this.tap.find({ to: toAddr });
  }

  public async findRecentTapsByIP(ipAddr: string) {
    const dayAgo = Math.floor(Date.now() / 1000) - 1 * 24 * 60 * 60; // last 24 hour
    return this.tap.find({
      ipAddr,
      timestamp: { $gt: dayAgo },
    });
  }

  public async create(tap: Tap) {
    let newTap = new this.tap(tap);
    newTap.timestamp = Math.floor(Date.now() / 1000);
    await newTap.save();
    return newTap;
  }
}

export default TapRepo;
