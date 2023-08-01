import axios from "axios";

const client = axios.create({
  baseURL: "https://api-ratethemovie.onrender.com/api",
});

export default client;
