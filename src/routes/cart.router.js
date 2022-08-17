const express = require('express'),
  router = express.Router(),
  CartController = require('../controllers/cart.controller');

class RouterCart {
  constructor() {
    this.controlador = new CartController();
  }

  start() {
    router.post('/', this.controlador.postCart);
    router.delete('/:id', this.controlador.deleteCart);
    router.post(`/:id/productos/:id_prod`, this.controlador.postProductCart);
    router.get('/:id/productos', this.controlador.getCart);
    router.delete('/:id/productos/:id_prod', this.controlador.deleteItemCart);
    router.post('/:id', this.controlador.editCart);
    return router;
  }
}

module.exports = RouterCart;
