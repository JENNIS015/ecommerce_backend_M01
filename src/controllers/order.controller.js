const APICustom = require('../classes/Error/customError');
const msgSend = require('../notificaciones/config/msjConfig'),
  newOrderEmail = require('../notificaciones/emails/Order/newOrder'),
  UserController = require('../controllers/user.controller'),
  CartController = require('../controllers/cart.controller'),
  OrderFactory = require('../classes/Order/OrderFactory.class.js');

class OrderController {
  constructor() {
    this.OrdenDAO = OrderFactory.get();
    this.user = new UserController();
    this.message = new APICustom();
    this.controladorCarrito = new CartController();
  }
  renderThanks = (req, res) => {
    res.render('gracias');
  };

  getOrderById = async (req, res) => {
    const id = req.params.id;
    try {
      const cart = await this.cart.getCartOrder(id);

      res.render('order', { title: 'Orden', producto: cart.items });
    } catch (error) {
      this.message.errorInternalServer(error, 'Error al guardar la orden');
    }
  };

  postOrder = async (req, res, done) => {
    try {
      const id = req.params.id;
      const body = req.body;

      const cart = await this.controladorCarrito.getItemsInCart(id);

      const buyerID = body.email;
      const name = body.name;
      const phone = body.phone;
      const shippingAddress = body.address;
      const items = cart.items;
      const total = cart.total;
      const timestamps = new Date().toLocaleString();

      const newOrder = {
        buyerID: buyerID,
        name: name,
        phone: phone,
        shippingAddress: shippingAddress,
        items: items,
        total: total,
        timestamps: timestamps,
      };

      const orden = await this.OrdenDAO.guardar(newOrder);
 
      if (orden) {
        newOrderEmail(orden);
            msgSend(orden.phone, orden);

        res.status(200).send(orden);
      }
    } catch (err) {
      this.message.errorInternalServer(err, 'Error al guardar la orden');
    }
  };
}
module.exports = OrderController;
