import mongoose from 'mongoose';

const cryptodcaSchema = mongoose.Schema({
  amount: String,
  cointype: String,
  freq: String,
  start: String,
  end: String,
  searchquery: String,
  timestamp: String,
  coinimageurl: String,
  user: String
});

export default mongoose.model('messagecontents', cryptodcaSchema)