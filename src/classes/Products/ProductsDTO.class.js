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
    this.oferta = productos.oferta;
    this.fecha = productos.fecha;
    this.alto = productos.alto;
    this.largo = productos.largo;
    this.profundidad = productos.profundidad;
    this.peso = productos.peso;
     this.modificado = new Date().toJSON().slice(0, 10);;
  }

  // getProductsAll = async () => {
  //   return (
  //     this.id, this.nombre, this.foto, this.categoria, this.precio, this.color
  //   );
  // };
}

module.exports = ProductDTO;
