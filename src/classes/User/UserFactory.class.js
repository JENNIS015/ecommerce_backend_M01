const { UserDAOMongoDB } = require('../../DAOs/DAOMongo'),
  config = require('../../utils/config');

class UserDAOFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        return new UserDAOMongoDB();

      default:
        return new UserDAOMongoDB();
    }
  }
}
module.exports = UserDAOFactory;
