const express = require('express'),
  router = express.Router(),
  OrderController = require('../controllers/order.controller');

class RouterOrder {
  constructor() {
    this.controlador = new OrderController();
  }

  start() {
    router.get('/gracias', this.controlador.renderThanks);
    router.get('/:id', this.controlador.getOrderById);
    router.post('/:id', this.controlador.postOrder);
    return router;
  }
}
module.exports = RouterOrder;
