import AppAxios2 from "../../config/axios2";
import { ObjectHelper } from "../../helper/object.helper";
import useCallApi from "../useCallApi";

const Base_Url = "/economy";

export interface IEconomyFilter {
  page?: number;
  size?: number;
}

export interface IEconomyChartFilter {
  startDate: string; // ISO string: "2024-01-01"
  endDate: string;
}

export default function useEconomyApi() {
  const { callApi } = useCallApi();

  async function search(filter: IEconomyFilter) {
    const params = ObjectHelper.getParamsFilter(filter);
    return callApi(AppAxios2.get(`${Base_Url}?${params}`));
  }

  async function getChartData(filter: IEconomyChartFilter) {
    const params = ObjectHelper.getParamsFilter(filter);
    return callApi(AppAxios2.get(`${Base_Url}/chart?${params}`));
  }

  async function create(data: any) {
    return callApi(AppAxios2.post(Base_Url, data));
  }

  async function update(id: string, data: any) {
    return callApi(AppAxios2.put(`${Base_Url}/${id}`, data));
  }

  async function get(id: string) {
    return callApi(AppAxios2.get(`${Base_Url}/${id}`));
  }

  async function deleteItem(id: string) {
    return callApi(AppAxios2.delete(`${Base_Url}/${id}`));
  }

  return {
    search,
    getChartData,
    create,
    update,
    get,
    deleteItem,
  };
}
