const APICustom = require('../classes/Error/customError');
const ProductDAOFactory = require('../classes/Products/ProductDAOFactory.class');
const msgSend = require('../notificaciones/config/msjConfig'),
  newOrderEmail = require('../notificaciones/emails/Order/newOrder'),
  UserController = require('../controllers/user.controller'),
  OrderFactory = require('../classes/Order/OrderFactory.class.js');
const ProductsController = require('./products.controller');

class OrderController {
  constructor() {
    this.OrdenDAO = OrderFactory.get();
    this.controladorProductos = new ProductsController();
    this.user = new UserController();
    this.message = new APICustom();
  }
 

  getOrders = async (req, res) => {
    try {
      const orders = await this.OrdenDAO.mostrarTodos();
      res.status(200).json({ data: orders });
    } catch (error) {
      this.message.errorInternalServer(error, 'Error al guardar las ordenes');
    }
  };
 
  updateById = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
      const data = await this.OrdenDAO.actualizar(id, body);
      res.status(200).send(data);
    } catch (err) {
      this.message.errorNotFound(err, 'Error al eliminar foto producto');
    }
  };

  deleteById = async (req, res) => {
    const id = req.params.id;

    try {
      const data = await this.OrdenDAO.eliminar('id', id);
      res.status(200).send(data);
    } catch (err) {
      this.message.errorNotFound(err, 'Error al eliminar orden');
    }
  };
  postOrder = async (req, res, done) => {
 
    try {
      const body = req.body;

      const timestamps = new Date().toLocaleString();

      const newOrder = {
        status: body.status,
        buyerID: body.buyerID,
        name: body.name,
        phone: body.phone,
        shippingAddress: body.shippingAddress,
        items: body.items,
        total: body.total,
        timestamps: timestamps,
      };

      const orden = await this.OrdenDAO.guardar(newOrder);

      await Promise.all(
        newOrder.items.map(async (item) => {
          let data = {
            id: item.id,
            cantidad: item.cantidad,
          };
          return await this.controladorProductos.discountStock({ body: data });
        })
      );

      // newOrderEmail(orden);
      //    msgSend(orden.phone, orden);

      res.status(200).json({ data: orden });
    } catch (err) {
      this.message.errorInternalServer(err, 'Error al guardar la orden');
    }
  };
}
module.exports = OrderController;
