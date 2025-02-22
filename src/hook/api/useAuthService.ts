import { ObjectHelper } from "../../helper/object.helper";
import AppAxios from "../../config/axios";
import useCallApi from "../useCallApi";

const Base_Url = "/auth";
export default function useAuthService() {
  const { callApi } = useCallApi();
  const getUserInfo = () => {
    return callApi(AppAxios.get(`${Base_Url}/get-user-info`));
  };

  const login = (data: { username: string; password: string }) => {
    return callApi(AppAxios.post(`${Base_Url}/login`, data));
  };

  const logout = () => {
    return callApi(AppAxios.post(`${Base_Url}/logout`));
  };

  const changePassword = (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    return callApi(AppAxios.post(`${Base_Url}/change-password`, data));
  };

  const searchUsers = (data: {
    search: string;
    role: string;
    page: number;
    size: number;
  }) => {
    const query = ObjectHelper.getParamsFilter(data);
    return callApi(AppAxios.get(`${Base_Url}/search-users?${query}`));
  };

  const saveUser = (
    data: {
      username: string;
      password: string;
      role: string;
      newUsername?: string;
    },
    mode: "create" | "update"
  ) => {
    return callApi(AppAxios.post(`${Base_Url}/save-user?mode=${mode}`, data));
  };

  const deleteUser = (id: any) => {
    return callApi(AppAxios.delete(`${Base_Url}/delete-user?id=${id}`));
  };

  return {
    getUserInfo,
    login,
    logout,
    changePassword,
    searchUsers,
    saveUser,
    deleteUser,
  };
}
