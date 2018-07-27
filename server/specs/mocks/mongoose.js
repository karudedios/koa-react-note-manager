import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';

const mockgoose = new Mockgoose(mongoose);

export default {
  setUp: async function(cb) {
    await mockgoose.prepareStorage();
    mongoose.connect('mongodb://0.0.0.0:27017/test', { useNewUrlParser: true }, cb);
  },
  
  reset: async function(cb) {
    await mockgoose.helper.reset();
    cb();
  },
  
  tearDown: async function(cb) {
    await mongoose.disconnect();
    cb();
  }
};
