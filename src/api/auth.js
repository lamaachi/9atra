import axios from "axios";
import { port } from "./global";
const API_URL = `http://192.168.1.7:${port}/api/v1/`

export const register = async (username, password,email,role) => {
    try {
      const response = await axios.post(`${API_URL}signup`, {
        username,
        password,
        email,
        role
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
};

export const login = async (username,password)=>{
  try{
    const response = await axios.post(`${API_URL}login`,{
        username,
        password  
    })
    return response.data.token;
  }catch(error){
    throw error.response.data
  }
}

