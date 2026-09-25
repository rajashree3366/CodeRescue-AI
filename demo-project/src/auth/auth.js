// Legacy authentication module
// Original developer left. Do not refactor without understanding dependencies.

const users = [
  {
    id: 1,
    email: "admin@shopsphere.local",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    email: "customer@shopsphere.local",
    password: "customer123",
    role: "customer"
  }
];

function login(email, password) {
  const user = users.find(u => u.email === email);

  if (!user) {
    return {
      success: false,
      message: "User not found"
    };
  }

  if (user.password === password) {
    return {
      success: true,
      userId: user.id,
      role: user.role
    };
  }

  return {
    success: false,
    message: "Invalid password"
  };
}

function getUserById(id) {
  return users.find(u => u.id === id);
}

function isAdmin(userId) {
  const user = getUserById(userId);
  return user && user.role === "admin";
}

module.exports = {
  login,
  getUserById,
  isAdmin
};
