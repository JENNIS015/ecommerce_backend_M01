const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  nombre: { type: String, require: true },
  descripcion: { type: String, require: false },
  precio: { type: Number, require: true },
  foto: [],
  categoria: { type: String, require: false },
  color: { type: String, require: false },
  stock: { type: Number, require: false },
  precioOferta: { type: Number, require: false },
  fechaOferta: { type: String, require: false },
  alto: { type: Number, require: false },
  largo: { type: Number, require: false },
  profundidad: { type: Number, require: false },
  peso: { type: Number, require: false },
  modificado: { type: String, require: false },
});
 
const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;
