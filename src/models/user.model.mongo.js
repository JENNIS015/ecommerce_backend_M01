const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    minLength: 4,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ref: { type: String, require: false },
  lastName: { type: String, require: false },
  address: { type: String, require: false },
  age: { type: Number, require: false },
  phone: { type: String, require: false },
  avatar: { type: String, require: false },
  membershipID: { type: Number, require: false },

});

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
