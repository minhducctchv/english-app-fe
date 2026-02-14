import AppAxios from "../../config/axios";
import { ObjectHelper } from "../../helper/object.helper";
import useCallApi from "../useCallApi";
import { mapApiToVoca, mapVocaToApi, IVocabulary } from "../../types/types";

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
    const response = await callApi(AppAxios.get(`${Base_Url}?${params}`));
    if (response?.data) {
      response.data = response.data.map((item: any) => mapApiToVoca(item));
    }
    return response;
  }

  async function create(data: IVocabulary) {
    const apiData = mapVocaToApi(data);
    return callApi(AppAxios.post(Base_Url, apiData));
  }

  async function update(id: string, data: IVocabulary) {
    const apiData = mapVocaToApi(data);
    return callApi(AppAxios.put(`${Base_Url}/${id}`, apiData));
  }

  async function get(id: string) {
    const response = await callApi(AppAxios.get(`${Base_Url}/${id}`));
    if (response) {
      return mapApiToVoca(response);
    }
    return response;
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
