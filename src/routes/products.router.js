const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products.controller');
const { isAdmin } = require('../passport/support');
const { upload, fileSizeLimitErrorHandler } = require('../utils/functions');
class RouterProduct {
  constructor() {
    this.controlador = new ProductsController();
  }

  start() {
    router.get('/',isAdmin, this.controlador.getProducts);
    router.post(
      '/', isAdmin,
      upload.any(),
      fileSizeLimitErrorHandler,
      this.controlador.saveProducts
    );
    router.delete('/:id', isAdmin, this.controlador.deleteProduct);
    router.put('/imagen/:id', isAdmin, this.controlador.editProductImagen);
    router.get('/:id', isAdmin, this.controlador.getProductId);
    router.get('/categoria/:id', isAdmin, this.controlador.getCategoriaId);
    router.get('/edit/:id', isAdmin, this.controlador.formEditProduct);
    router.put(
      '/:id',
      upload.any(),
      isAdmin,
      fileSizeLimitErrorHandler,
      this.controlador.editProduct
    );
       router.put('/stock', isAdmin, this.controlador.discountStock);

    return router;
  }
}
module.exports = RouterProduct;
