const { CategoryDAOMongoDB } = require('../../DAOs/DAOMongo');
const config = require('../../utils/config');

class CategoryDAOFactory {
  static get() {
    
    switch (config.SRV.persistencia) {
      case 'mongodb':
        return new CategoryDAOMongoDB();
    
      //..
      default:
        return;
    }
  }
}
module.exports = CategoryDAOFactory;
