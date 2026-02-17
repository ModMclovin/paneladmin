import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5237/",
});

export default api;
