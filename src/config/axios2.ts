import axios from "axios";
import { StorageHelper } from "../helper/storage.helper";
const url = "https://english-app-be.vercel.app";
// const url2 = "https://learn-app-be.vercel.app";
const url2 = "http://localhost:3000";

export const VOC_AI_ACCESS_TOKEN = "english-app-access";
export const VOC_AI_REFRESH_TOKEN = "english-app-refresh";
export const VOC_AI_USER_INFO = "english-app-user-info";

const AppAxios2 = axios.create({
  withCredentials: true,
  baseURL: url2,
  timeout: 60 * 10 * 1000,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

AppAxios2.interceptors.request.use(
  async (config: any) => {
    const accessToken = StorageHelper.get(VOC_AI_ACCESS_TOKEN);
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AppAxios2.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        StorageHelper.set(VOC_AI_ACCESS_TOKEN, newAccessToken);
        AppAxios2.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return AppAxios2(originalRequest);
      } catch (_err) {
        StorageHelper.remove(VOC_AI_ACCESS_TOKEN);
        StorageHelper.remove(VOC_AI_REFRESH_TOKEN);
        StorageHelper.remove(VOC_AI_USER_INFO);
        // window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    if (error.response.status === 403) {
      StorageHelper.remove(VOC_AI_ACCESS_TOKEN);
      StorageHelper.remove(VOC_AI_REFRESH_TOKEN);
      StorageHelper.remove(VOC_AI_USER_INFO);
      //   window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  const refreshToken = StorageHelper.get(VOC_AI_REFRESH_TOKEN);
  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }
  const result = await axios.post(`${url}/auth/refresh-token`, {
    token: refreshToken,
  });
  return result.data.accessToken;
};

export default AppAxios2;
