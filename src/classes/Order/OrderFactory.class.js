const { OrderDAOMongoDB } = require('../../DAOs/DAOMongo'),
  config = require('../../utils/config');

class OrderDAOFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        return new OrderDAOMongoDB();

      default:
        return new OrderDAOMongoDB();
    }
  }
}
module.exports = OrderDAOFactory;
