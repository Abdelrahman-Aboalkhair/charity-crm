import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await axiosInstance.post("/auth/refresh-token");

//         return axios(originalRequest);
//       } catch (refreshError) {
//         console.error("Failed to refresh token", refreshError);
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
