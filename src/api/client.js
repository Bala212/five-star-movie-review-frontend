import axios from "axios";

const client = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://api-ratethemovie.onrender.com/api",
});

export default client;
