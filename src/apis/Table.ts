import { axiosInstance, baseAxiosInstanse } from "./AxiosConfig";

export const addTableRow = async () => {
    try {
        const response = await baseAxiosInstanse.post(
            '',

        );
        return response;
    } catch (error) {
        console.log("TABLE 행 추가 api 통신 실패", error);
    }
}

// table data road api
export const getTableData = async ({ tableDataValues, APIURLValue } : any) => {
    console.log("tableDataValues: ", tableDataValues);
    try {
      const response = await axiosInstance.get(`${APIURLValue}`, {params: tableDataValues});
      console.log(response)
      return response.data;
    } catch (error) {
      console.log("api 통신 실패 ", error);
      return Promise.reject(error);
    }
  }