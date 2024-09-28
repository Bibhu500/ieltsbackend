import mongoose from 'mongoose';

const cardMemeSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true
  },
  meaning: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  sentence: {
    type: String,
    required: true
  },
  synonyms: {
    type: String,
    required: true
  },
  antonyms: {
    type: String,
    required: true
  },
  parts_of_speech: {
    type: String,
    required: true
  },
  verbforms: {
    type: String,
    required: true
  },
  cref_type: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  updatedBy: {
    type: String  
  },
  updatedDate: {
    type: Date 
  }
}, {
  timestamps: false
});

const cardMemeData = mongoose.model('cardMemeData', cardMemeSchema);

export { cardMemeData };