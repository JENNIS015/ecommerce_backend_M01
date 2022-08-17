const mongoose = require('mongoose');
 

const CartSchema = mongoose.Schema({
  buyerID: {
    type: String,
    ref: 'User',
  },
  items: [
    {
      itemId: String,
      foto: String,
      nombre: String,
      cantidad: {
        type: Number,
        min: 1,
        default: 1,
      },
      precio: Number
    },
  ],
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingAddress: String,
  timestamps: String,
});

const CartModel = mongoose.model('cart', CartSchema);

module.exports = CartModel;
