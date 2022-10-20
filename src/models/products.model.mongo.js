const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  nombre: { type: String, require: true },
  descripcion: { type: String, require: false },
  precio: { type: Number, require: true, default: 0 },
  foto: [
    {
      type: String,
      required: false,  
    },
  ],
  categoria: { type: String, require: false },
  color: { type: String, require: false },
  stock: { type: Number, require: false, default: 0 },
  oferta: { type: Number, require: false, default: 0 },
  destacado: { type: Boolean, require: false, default: false },
  fecha: { type: String, require: false },
  alto: { type: Number, require: false, default: 0 },
  largo: { type: Number, require: false, default: 0 },
  profundidad: { type: Number, require: false, default: 0 },
  peso: { type: Number, require: false, default: 0 },
  modificado: { type: String, require: false },
});
 
const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;
