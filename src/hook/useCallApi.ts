import { useAppContext } from "../context/AppProvider";

export default function useCallApi() {
  const { setUserInfo } = useAppContext();

  const callApi = (promise: Promise<any>) => {
    return promise
      .then(({ data }) => {
        return data;
      })
      .catch(({ response }) => {
        if (response?.status === 403) {
          setUserInfo(undefined);
        }
        throw response?.data?.message || "Something went wrong.";
      });
  };
  return {
    callApi,
  };
}
