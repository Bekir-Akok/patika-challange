import axios from "axios";
import { showNotification } from "@mantine/notifications";

//local imports
import { statusCode } from "@/utils/status-code";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MAIN_URL,
  withCredentials: true,
});

const responseSuccessInterceptor = (response) => {
  if (
    response.config.hasOwnProperty("handleNotification") &&
    response.config.handleNotification === true
  ) {
    const successMessage = statusCode[response?.data?.status_code] || "Success";
    showNotification({
      title: successMessage,
      color: "lime",
      autoClose: 3000,
    });
  }
  return response;
};

const responseErrorInterceptor = async (error) => {
  if (
    (error?.config?.hasOwnProperty("handleNotification") &&
      error?.config?.handleNotification === true) ||
    (error?.config?.hasOwnProperty("onlyError") &&
      error?.config?.onlyError === true)
  ) {
    const errorMessage =
      statusCode[error.response?.data?.status_code] || "Failure";
    showNotification({
      title: errorMessage,
      color: "red",
    });
  }

  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
  responseSuccessInterceptor,
  responseErrorInterceptor
);

export default axiosInstance;
