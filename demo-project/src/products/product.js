// Legacy product catalog module
// Product data is maintained directly in application memory.

const products = [
  { id: 101, name: "Laptop", price: 65000, stock: 12 },
  { id: 102, name: "Headphones", price: 2500, stock: 30 },
  { id: 103, name: "Keyboard", price: 1800, stock: 20 },
  { id: 104, name: "Mouse", price: 900, stock: 40 }
];

function getProducts() {
  return products;
}

function getProductById(id) {
  return products.find(product => product.id === id);
}

function searchProducts(keyword) {
  return products.filter(product =>
    product.name.toLowerCase().includes(keyword.toLowerCase())
  );
}

function updateStock(productId, quantity) {
  const product = getProductById(productId);

  if (!product) {
    return false;
  }

  product.stock -= quantity;
  return true;
}

module.exports = {
  getProducts,
  getProductById,
  searchProducts,
  updateStock
};
