const userService = require('../services/userService');

module.exports = {
  user: async ({ id }) => userService.getUserById(id),

  users: async () => userService.getAllUsers(),

  addUser: async ({ name, email, password }) =>
    userService.createUser({ name, email, password }),

  updateUser: async ({ id, name, email, password }) =>
    userService.updateUser({ id, name, email, password }),

  deleteUser: async ({ id }) => userService.deleteUser(id)
};