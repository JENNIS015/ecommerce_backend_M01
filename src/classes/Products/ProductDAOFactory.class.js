const { ProductosDAOMongoDB } = require('../../DAOs/DAOMongo');
const config = require('../../utils/config');

class ProductDAOFactory {
  static get() {
      console.log('Persistencia: ', config.SRV.persistencia);
    switch (config.SRV.persistencia) {
      case 'mongodb':
        return new ProductosDAOMongoDB();
      case 'file':
        return new ProductDAOFile();
      //..
      default:
        return;
    }
  }
}
module.exports = ProductDAOFactory;
