// services/userService.js
const axios = require('axios');

class UserService {
  constructor(supabaseUrl, headers) {
    this.supabaseUrl = supabaseUrl;
    this.headers = headers;
  }

  async updateUser(id, userData) {
    try {
      const response = await axios.patch(
        `${this.supabaseUrl}/rest/v1/users?id=eq.${id}`,
        userData,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error(error.message);
      throw new Error('Internal server error');
    }
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
      console.error(error.message);
      throw new Error('Internal server error');
    }
  }
}

module.exports = UserService;
