import axios from "axios";
import { port } from "./variables/global";
const API_URL = `http://localhost:${port}/api/v1/`

export const createUser = async (username, password, authorities) => {
    try {
      const response = await axios.post(`${API_URL}signup`, {
        username,
        password,
        authorities,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };