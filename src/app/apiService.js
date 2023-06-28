import axios from "axios";

const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiService.interceptors.request.use(
  request => {
    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  response => {
    return response.data;
  },
  function (error) {
    const message = error.response?.data?.message || "Unknown error";
    return Promise.reject({ message });
  }
);

export default apiService;
