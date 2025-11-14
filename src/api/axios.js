import axios from "axios";

const api = axios.create({
  baseURL: "https://6819ec4d581c.ngrok-free.app", // ✅ backend base URL
});

export default api;
