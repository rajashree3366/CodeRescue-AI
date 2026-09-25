// Legacy payment module
// WARNING: This module is used by checkout and order processing.

function processPayment(order, paymentDetails) {
  if (!order || !paymentDetails) {
    return {
      success: false,
      message: "Invalid payment request"
    };
  }

  // Simulated payment processing
  if (paymentDetails.cardNumber && paymentDetails.cvv) {
    return {
      success: true,
      transactionId: "TXN-" + Date.now(),
      amount: order.total
    };
  }

  return {
    success: false,
    message: "Payment failed"
  };
}

function refundPayment(transactionId, amount) {
  if (!transactionId) {
    return false;
  }

  console.log("Refund requested:", transactionId, amount);

  return true;
}

module.exports = {
  processPayment,
  refundPayment
};
