// Dummy Repository Layer
// Demonstrates a clean architecture separation of concerns.

const { User } = require('../models');

class UserRepository {
  async findById(id) {
    try {
      return await User.findByPk(id);
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async updateUserRole(id, role) {
    try {
      const user = await User.findByPk(id);
      if (!user) return null;
      user.role = role;
      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Error updating user role: ${error.message}`);
    }
  }
}

module.exports = new UserRepository();
