import mongoose from 'mongoose';

export default {
  mock: mongoose,
  
  setUp: function(cb) {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect('mongodb://0.0.0.0:27017/test', { useNewUrlParser: true }, cb);
    }
  },
  
  tearDown: function(cb) {
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.db.dropDatabase(function(err) {
        if (err) return cb(err);
        mongoose.disconnect();
        cb();
      });
    }
  }
};
