import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  email: String,
  role: String,
  roadmap: {
    listening: {
      part1: Boolean,
      part2: Boolean,
      part3: Boolean
    },
    speaking: {
      part1: Boolean,
      part2: Boolean
    },
    writing: {
      essay1: Boolean,
      essay2: Boolean
    },
    reading: {
      part1: Boolean,
      part2: Boolean,
      part3: Boolean,
      part4: Boolean
    }
  }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;