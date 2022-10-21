const express = require('express'),
  router = express.Router(),
  OrderController = require('../controllers/order.controller'),
  { isAdmin } = require('../auth/support');

class RouterOrder {
  constructor() {
    this.controlador = new OrderController();
  }

  start() {
 
    router.put('/:id', isAdmin, this.controlador.updateById);
    router.delete('/:id', isAdmin, this.controlador.deleteById);
    router.get('/', isAdmin, this.controlador.getOrders);
    router.post('/', this.controlador.postOrder);
    return router;
  }
}
module.exports = RouterOrder;
