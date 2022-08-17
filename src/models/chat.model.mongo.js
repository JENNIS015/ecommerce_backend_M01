const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

/////Conversation
const UserOnlineSchema = mongoose.Schema({
  socketID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  membership: {
    type: String,
  },
});
 
//Messages

const MessageSchema = mongoose.Schema({
  name: {
    type: String,
  },

  from: {
    type: String,
  },
  to: {
    type: String,
  },
  message: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
});

const ConversationModel = mongoose.model('User_Online', UserOnlineSchema);
const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = { ConversationModel,  MessageModel };
