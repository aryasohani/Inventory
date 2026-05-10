import axios from "axios";

const API = axios.create({
  baseURL: "https://inventory-backend07.onrender.com",
});

export default API;
