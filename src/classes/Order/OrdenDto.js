class OrdenDTO {
  constructor(orden) {
    this.buyerID = orden.buyerID;
    this.name = orden.name;
    this.status = orden.status;
    this.phone = orden.phone;
    this.shippingAddress = orden.shippingAddress;
    this.items = orden.items;
    this.total = orden.total;
    this.timestamps = orden.timestamps;
    this.orderStatus = orden.orderStatus;
  }
}
module.exports = OrdenDTO;
