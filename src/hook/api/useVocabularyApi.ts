import AppAxios from "../../config/axios";
import { ObjectHelper } from "../../helper/object.helper";
import useCallApi from "../useCallApi";

const Base_Url = "/vocabulary";

export interface ISearchFilter {
  page?: number; // start from 1
  size?: number;
  search?: string;
  partsOfSpeech?: string;
  isToday?: boolean;
  isPast?: boolean;
  isExact?: boolean;
}

export default function useVocabularyApi() {
  const { callApi } = useCallApi();
  async function search(filter: ISearchFilter) {
    const params = ObjectHelper.getParamsFilter(filter);
    return callApi(AppAxios.get(`${Base_Url}?${params}`));
  }

  async function create(data: any) {
    return callApi(AppAxios.post(Base_Url, data));
  }

  async function update(id: string, data: any) {
    return callApi(AppAxios.put(`${Base_Url}/${id}`, data));
  }

  async function get(id: string) {
    return callApi(AppAxios.get(`${Base_Url}/${id}`));
  }

  async function deleteItem(id: string) {
    return callApi(AppAxios.delete(`${Base_Url}/${id}`));
  }

  return {
    search,
    create,
    update,
    get,
    deleteItem,
  };
}
