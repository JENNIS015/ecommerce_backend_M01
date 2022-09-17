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
    router.put('/:id', this.controlador.updateById);
    router.delete('/:id', this.controlador.deleteById);
    router.get('/', this.controlador.getOrders);
    router.post('/', this.controlador.postOrder);
    return router;
  }
}
module.exports = RouterOrder;
