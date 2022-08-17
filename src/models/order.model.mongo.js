const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const OrderSchema = mongoose.Schema({
  buyerID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  phone: { type: String },
  items: [
    {
      itemId: String,
      foto: String,
      nombre: String,
      cantidad: Number,
      precio: Number,
      _id: { type: mongoose.Types.ObjectId }
    },
  ],
  total: Number,
  timestamps: String,
});
 
const OrderModel = mongoose.model('orders', OrderSchema);

module.exports = OrderModel;
