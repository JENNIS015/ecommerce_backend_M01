const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  nombre: { type: String, require: true },
});

const CategoryModel = mongoose.model('category', CategorySchema);

module.exports = CategoryModel;
