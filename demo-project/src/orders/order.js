// Legacy order module
// Stores orders in memory. Database migration was planned but never completed.

const orders = [];

function createOrder(userId, items, paymentResult) {
  if (!userId || !items || items.length === 0) {
    return {
      success: false,
      message: "Invalid order"
    };
  }

  const order = {
    id: orders.length + 1001,
    userId: userId,
    items: items,
    transactionId: paymentResult.transactionId,
    status: "CONFIRMED",
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  return {
    success: true,
    order: order
  };
}

function getOrder(orderId) {
  return orders.find(order => order.id === orderId);
}

function cancelOrder(orderId) {
  const order = getOrder(orderId);

  if (!order) {
    return false;
  }

  order.status = "CANCELLED";
  return true;
}

module.exports = {
  createOrder,
  getOrder,
  cancelOrder
};
