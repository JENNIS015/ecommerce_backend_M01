class OrdenDTO {
  constructor(orden) {
    this.buyerID = orden.buyerID;
    this.name = orden.name;
    this.phone = orden.phone;
    this.shippingAddress = orden.shippingAddress;
    this.items = orden.items;
    this.total = orden.total;
    this.timestamps = orden.timestamps;
  }
}
module.exports = OrdenDTO;
