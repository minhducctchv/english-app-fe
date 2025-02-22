import AppAxios2 from "../../config/axios2";
import { ObjectHelper } from "../../helper/object.helper";
import useCallApi from "../useCallApi";

const Base_Url = "/course";

export interface ICourseFilter {
  page?: number; // start from 1
  size?: number;
  title?: string;
  parentId?: string;
  date?: Date;
}

export default function useCourseApi() {
  const { callApi } = useCallApi();
  async function search(filter: ICourseFilter) {
    const params = ObjectHelper.getParamsFilter(filter);
    return callApi(AppAxios2.get(`${Base_Url}?${params}`));
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
    create,
    update,
    get,
    deleteItem,
  };
}
