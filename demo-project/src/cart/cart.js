// Legacy cart module
// Cart logic has accumulated over several versions of the application.

const carts = {};

function getCart(userId) {
  if (!carts[userId]) {
    carts[userId] = [];
  }

  return carts[userId];
}

function addItem(userId, product, quantity) {
  const cart = getCart(userId);

  const existing = cart.find(item => item.productId === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity
    });
  }

  return cart;
}

function removeItem(userId, productId) {
  const cart = getCart(userId);

  const index = cart.findIndex(item => item.productId === productId);

  if (index === -1) {
    return false;
  }

  cart.splice(index, 1);
  return true;
}

function clearCart(userId) {
  carts[userId] = [];
}

module.exports = {
  getCart,
  addItem,
  removeItem,
  clearCart
};
