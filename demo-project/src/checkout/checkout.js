// Legacy checkout module
// Handles the final stage before an order is created.

const payment = require("../payment/payment");

function calculateTotal(items) {
  if (!items || items.length === 0) {
    return 0;
  }

  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

function checkout(userId, items, paymentDetails) {
  const total = calculateTotal(items);

  if (total <= 0) {
    return {
      success: false,
      message: "Cart is empty"
    };
  }

  const order = {
    userId: userId,
    items: items,
    total: total
  };

  const result = payment.processPayment(order, paymentDetails);

  if (!result.success) {
    return {
      success: false,
      message: "Checkout failed: " + result.message
    };
  }

  return {
    success: true,
    transactionId: result.transactionId,
    amount: result.amount
  };
}

module.exports = {
  calculateTotal,
  checkout
};
