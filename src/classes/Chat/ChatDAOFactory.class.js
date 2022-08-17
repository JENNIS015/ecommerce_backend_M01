const {
    ConversationsDAOMongoDB,
    ChannelDAOMongoDB,
    MessageDAOMongoDB,
  } = require('../../DAOs/DAOMongo'),
  config = require('../../utils/config');

class UserOnlineFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        return new ConversationsDAOMongoDB();
      default:
        return new ConversationsDAOMongoDB();
    }
  }
}
 
class MessageDAOFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        return new MessageDAOMongoDB();
      default:
        return new MessageDAOMongoDB();
    }
  }
}
module.exports = { MessageDAOFactory, UserOnlineFactory };
