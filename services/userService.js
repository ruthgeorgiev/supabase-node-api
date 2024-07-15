const axios = require('axios');

class UserService {
  constructor(supabaseUrl, headers) {
    this.supabaseUrl = supabaseUrl;
    this.headers = headers;
  }

  async createUser(userData) {
    try {
      const response = await axios.post(
        `${this.supabaseUrl}/rest/v1/users`,
        userData,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      throw new Error('Internal server error');
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await axios.patch(
        `${this.supabaseUrl}/rest/v1/users?id=eq.${id}`,
        userData,
        { headers: this.headers }
      );
      return response.data[0];
    } catch (error) {
      console.error(`Error updating user: ${error.message}`);
      throw new Error('Internal server error');
    }
  }

  async getUsers() {
    try {
      const response = await axios.get(`${this.supabaseUrl}/rest/v1/users`, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error(`Error fetching users: ${error.message}`);
      throw new Error('Internal server error');
    }
  }

  async getUserById(id) {
    try {
      const response = await axios.get(
        `${this.supabaseUrl}/rest/v1/users?id=eq.${id}`,
        { headers: this.headers }
      );
      return response.data[0];
    } catch (error) {
      console.error(`Error fetching user by ID: ${error.message}`);
      throw new Error('Internal server error');
    }
  }

  async deleteUser(id) {
    try {
      await axios.delete(
        `${this.supabaseUrl}/rest/v1/users?id=eq.${id}`,
        { headers: this.headers }
      );
    } catch (error) {
      console.error(`Error deleting user: ${error.message}`);
      throw new Error('Internal server error');
    }
  }

  async getUserOrders(id) {
    try {
      const response = await axios.get(
        `${this.supabaseUrl}/rest/v1/orders?user_id=eq.${id}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching user orders: ${error.message}`);
      throw new Error('Internal server error');
    }
  }

  async checkUserInactive(id) {
    try {
      const ordersResponse = await axios.get(
        `${this.supabaseUrl}/rest/v1/orders?user_id=eq.${id}`,
        { headers: this.headers }
      );
      if (ordersResponse.data.length === 0) {
        const result = await axios.patch(
          `${this.supabaseUrl}/rest/v1/users?id=eq.${id}`,
          { active: false },
          { headers: this.headers }
        );
        return result.data[0];
      } else {
        throw new Error('User has orders');
      }
    } catch (error) {
      if (error.message === 'User has orders') {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }
}

module.exports = UserService;
