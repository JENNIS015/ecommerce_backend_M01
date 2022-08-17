class ProductDTO {
  constructor(productos) {
    this.id = productos.id;
    this.nombre = productos.nombre;
    this.descripcion = productos.descripcion;
    this.foto = productos.foto;
    this.categoria = productos.categoria;
    this.precio = productos.precio;
    this.stock = productos.stock;
    this.color = productos.color;
  }

  getProductsAll = async () => {
    return (
      this.id, this.nombre, this.foto, this.categoria, this.precio, this.color
    );
  };
}
module.exports = ProductDTO;
