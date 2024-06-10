import {axiosInstance, baseAxiosInstanse} from "./AxiosConfig";

interface JoinFormProps {
  name: string;
  id: string;
  password: string;
  phone: string;
}

interface LoginFormProps {
  id: string;
  password: string;
}

// interface UserDataProps {
//   page: number;
//   size: number | null;
//   name: string | null;
//   address: string | null;
//   phone: string | null;
// }

// 회원가입 api
export const join = async ({ values } : {values: JoinFormProps}) => {
  try {
    const response = await baseAxiosInstanse.post(
      "/api/v1/auth/register/admin",
      values,
    );
    return response.data;
  } catch (error) {
    console.log("api 통신 실패 ", error);
    return Promise.reject(error);
  }
};

// 로그인 api
export const login = async ({ id, password }: LoginFormProps) => {
  try {
    const formData = {
      id,
      password,
    };
    const response = await baseAxiosInstanse.post(
      "/api/v1/auth/login",
      formData,
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("api 통신 실패 ", error);
    return Promise.reject(error);
  }
};

// 계정정보 api
export const getAccountData = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/user/info");
    return response.data;
  } catch (error) {
    console.log("api 통신 실패 ", error);
    return Promise.reject(error);
  }
};

// // 사용자 목록 api
// export const getUserList = async ({ userDataValues } : {userDataValues: UserDataProps}) => {
//   console.log("userDataValues: ", userDataValues);
//   try {
//     const response = await axiosInstance.get("/api/v1/admin/user/clients", {params: userDataValues});
//     return response.data;
//   } catch (error) {
//     console.log("api 통신 실패 ", error);
//     return Promise.reject(error);
//   }
// }