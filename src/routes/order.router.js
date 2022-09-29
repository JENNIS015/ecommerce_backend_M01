const express = require('express'),
  router = express.Router(),
  OrderController = require('../controllers/order.controller'),
  { isAdmin } = require('../passport/support');

class RouterOrder {
  constructor() {
    this.controlador = new OrderController();
  }

  start() {
    router.get('/gracias', this.controlador.renderThanks);
    router.get('/:id', this.controlador.getOrderById);
    router.put('/:id', isAdmin, this.controlador.updateById);
    router.delete('/:id', isAdmin, this.controlador.deleteById);
    router.get('/', isAdmin, this.controlador.getOrders);
    router.post('/', this.controlador.postOrder);
    return router;
  }
}
module.exports = RouterOrder;
