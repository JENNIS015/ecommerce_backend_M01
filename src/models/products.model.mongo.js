const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  nombre: { type: String, require: true },
  descripcion: { type: String, require: false },
  precio: { type: Number, require: true },
  foto: { type: String, require: false },
  categoria: { type: String, require: true },
  color: { type: String, require: false },
  stock: { type: Number, require: true }
});
 
const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;
