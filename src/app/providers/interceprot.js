import axiosClient from "./client";

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request:", config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // return only data
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("Unauthorized");
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;

        case 403:
          console.log("Forbidden");
          break;

        case 500:
          console.log("Server Error");
          break;

        default:
          console.log(error.response.data.message);
      }
    }

    return Promise.reject(error);
  }
);