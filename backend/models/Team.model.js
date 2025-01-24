import mongoose from 'mongoose';

const TeamSchema =new mongoose.Schema({
  name: { type: String, required: true }, 
  logo: String,
  count: { type: Number, default: 0 },
  team: { type: String, required: true } 
},{
  collection: 'teams'
});

export const Team = mongoose.model("Team", TeamSchema);