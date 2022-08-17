function CartDTO(shippingAddress, items, buyerID, total, timestamps) {
  return {
    shippingAddress,
    items,
    buyerID,
    total,
    timestamps,
  };

  
}
module.exports = CartDTO;
