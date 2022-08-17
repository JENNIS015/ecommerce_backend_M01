const { ProductosDAOMongoDB } = require('../../DAOs/DAOMongo');
const config = require('../../utils/config');

class ProductDAOFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        return new ProductosDAOMongoDB();
      //..
      default:
        return;
    }
  }
}
module.exports = ProductDAOFactory;
