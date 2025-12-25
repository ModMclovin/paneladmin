import axios from "axios";

const api = axios.create({
  baseURL: "https://b63d0477cea0.ngrok-free.app/",
});

export default api;
