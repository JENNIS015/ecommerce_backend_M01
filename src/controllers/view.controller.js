const ProductsController = require('./products.controller');
const CartController = require('./cart.controller');
const config = require('../utils/config');
const APICustom = require('../classes/Error/customError');
const UserController = require('./user.controller');
const x = require('uniqid');

class RequestViews {
  constructor() {
    this.controladorProductos = new ProductsController();
    this.controladorCarrito = new CartController();
    this.controladorUser = new UserController();
    this.message = new APICustom();
  }

  indexPage = (req, res) => {
    res.render('index', { title: 'Inicio' });
  };

  obtenerCategorias = async (req, res) => {
    const cat = await this.controladorProductos.categories();
    res.status(200).json({ cat });
  };
  obtenerPrecios = async (req, res) => {
    const item = await this.controladorProductos.price();
    res.status(200).json({ item });
  };
  obtenerColores = async (req, res) => {
    const item = await this.controladorProductos.color();

    res.status(200).json(item.map((nombre,i) => ({ nombre, checked: false, id:i })));
  };
 


}
module.exports = RequestViews;
