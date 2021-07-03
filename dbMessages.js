import mongoose from 'mongoose';

const cryptodcaSchema = mongoose.Schema({
  amount: String,
  cointype: String,
  end: String,
  freq: String,
  start: String,
  end: String,
  searchquery: String,
  timestamp: String,
  user: String
});

export default mongoose.model('messagecontents', cryptodcaSchema)