const { rmSync } = require('fs');
const CartDTO = require('../classes/Cart/CartDTO.class'),
  CartDAOFactory = require('../classes/Cart/CartDAOFactory.class'),
  ProductDAOFactory = require('../classes/Products/ProductDAOFactory.class'),
  APICustom = require('../classes/Error/customError');

class CartController {
  constructor() {
    this.ProductsDAO = ProductDAOFactory.get();
    this.cartDAO = CartDAOFactory.get();
    this.message = new APICustom();
  }

  ///view///
  getItemsInCart = async (id) => {
    try {
      let cart = await this.cartDAO.mostrarId(id);
      return cart;
    } catch (err) {
      this.message.errorInternalServer(
        err,
        ' No se ha podido encontrar items en carrito'
      );
    }
  };

  
  postCart = async (req, res) => {
    let buyerEmail = req.user ? req.user.email : '';
    let address = req.user ? req.user.address : '';
    try {
      const items = [];
      const buyerID = buyerEmail;
      const total = 0;
      const timestamps = new Date().toLocaleString();
      const shippingAddress = address;

      const carritoGuardado = new CartDTO(
        shippingAddress,
        items,
        buyerID,
        total,
        timestamps
      );
      const cart = await this.cartDAO.guardar(carritoGuardado);

      res.json({
        cart: cart,
      });
    } catch (err) {
      this.message.errorInternalServer(err, 'Error al guardar carrito');
    }
  };

  getCart = async (req, res) => {
    const idCart = req.params.id;
    let list;
    try {
      const carritoCompleto = await this.cartDAO.mostrarId(idCart);

      if (carritoCompleto) {
        list = carritoCompleto.items.map((item) => {
          return {
            nombre: item.nombre,
            foto: item.foto,
            precio: item.precio,
            quantity: item.cantidad,
            subtotal: item.cantidad * item.precio,
            itemId: item.itemId,
          };
        });
      } else {
        list = [];
      }
      res.status(200).json({ producto: list, cartID: idCart });
    } catch (error) {
      res.render('carrito', {
        producto: [],
        error: true,
      });
      this.message.errorInternalServer(err, 'Error al obtener al carrito');
    }
  };

  postProductCart = async (req, res) => {
    const idCart = req.params.id,
      itemId = req.params.id_prod,
      cantidad = 1;

    try {
      let cart = await this.cartDAO.mostrarId(idCart);
      let item = await this.ProductsDAO.mostrarId(itemId);

      if (cart.items == undefined) {
        cart.items = [];
      }
      const precio = item.precio,
        nombre = item.nombre,
        foto = item.foto;

      const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);

      if (itemIndex > -1) {
        let product = cart.items[itemIndex];

        product.cantidad += cantidad;

        cart.items[itemIndex] = product;
      } else {
        cart.items.push({ itemId, nombre, cantidad, precio, foto });
      }

      cart.total = cart.items.reduce((acc, curr) => {
        return acc + curr.cantidad * curr.precio;
      }, 0);

      await this.cartDAO.actualizar(idCart, cart);

      res.status(200).send(cart);
    } catch (err) {
      this.message.errorInternalServer(err, 'Error al agregar al carrito');
    }
  };

  editCart = async (req, res) => {
    try {
      const id = req.params.id;

      const nuevoDatos = {
        buyerID: req.body.email,
        shippingAddress: req.body.address,
      };

      const cart = await this.cartDAO.actualizar(id, nuevoDatos);
 
      res.status(200).send(cart);

      //   res.redirect(`../pedido/${id}`);
    } catch (error) {
      this.message.errorInternalServer(
        error,
        'No se ha podido actualizar carrito'
      );
    }
  };

  getCartOrder = async (id) => {
    try {
      const cartComplete = await this.cartDAO.mostrarId(id);

      return cartComplete;
    } catch (err) {
      this.message.errorInternalServer(
        err,
        'Error al obtener orden del carrito'
      );
    }
  };
  deleteCart = async (req, res) => {
    const idCart = req.params.id;

    try {
      let carrito = await this.cartDAO.mostrarId(idCart);

      carrito.items = [];
      carrito.total = 0;
      const carritoVacio = await this.cartDAO.actualizar(idCart, carrito);

      res.status(200).send(carritoVacio);
    } catch (error) {
      this.message.errorInternalServer(error, 'Error al borrar carrito');
    }
  };

  deleteItemCart = async (req, res) => {
    const idCart = req.params.id,
      itemId = req.params.id_prod;

    try {
      let carrito = await this.getItemsInCart(idCart);
      const itemIndex = carrito.items.findIndex(
        (item) => item.itemId == itemId
      );

      if (itemIndex > -1) {
        let item = carrito.items[itemIndex];
        carrito.total -= item.cantidad * item.precio;
        if (carrito.total < 0) {
          carrito.total = 0;
        }
        carrito.items.splice(itemIndex, 1);
        carrito.total = carrito.items.reduce((acc, curr) => {
          return acc + curr.cantidad * curr.precio;
        }, 0);

        await this.cartDAO.actualizar(idCart, carrito);
        res.status(200).send(carrito);
      } else {
        res.status(404).send('No se encontro el item');
      }
    } catch (error) {
      this.message.errorInternalServer(error, 'Error al borrar item carrito');
    }
  };
}

module.exports = CartController;
