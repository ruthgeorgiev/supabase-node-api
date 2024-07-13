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
      console.log(`Fetching orders for user ID: ${id}`);
      const ordersResponse = await axios.get(
        `${this.supabaseUrl}/rest/v1/orders?user_id=eq.${id}`,
        { headers: this.headers }
      );
      console.log(`Orders found: ${ordersResponse.data.length}`);
      if (ordersResponse.data.length === 0) {
        console.log(`No orders found for user ID: ${id}. Setting user as inactive.`);
        const result = await axios.patch(
          `${this.supabaseUrl}/rest/v1/users?id=eq.${id}`,
          { active: false },
          { headers: this.headers }
        );
        console.log(`User ID: ${id} set to inactive. Result: ${JSON.stringify(result.data)}`);
        return result.data[0];  // Ensure the updated user is returned
      } else {
        console.log(`User ID: ${id} has orders.`);
        throw new Error('User has orders');
      }
    } catch (error) {
      console.error(`Error checking inactivity for user ID: ${id} - ${error.message}`);
      if (error.message === 'User has orders') {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }
}

module.exports = UserService;
