import axios from "axios";
import { useAuthStore } from "../store/AuthStore";
import { useLoadingStore } from "../store/LoadingStore";

// 토큰이 없는 경우 (회원가입, 로그인)
const baseAxiosInstanse = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_PEFAM_URL,
})

baseAxiosInstanse.interceptors.request.use(
  (config) => {
    useLoadingStore.setState({ isLoading: true });
    return config;
  },
  (error) => {
    useLoadingStore.setState({ isLoading: false });
    console.log(error)
    return Promise.reject(error);
  },
);

baseAxiosInstanse.interceptors.response.use(
  (response) => {
    useLoadingStore.setState({ isLoading: false });
    if (response.data) {
      console.log(response.data)
      return response;
    }
    return Promise.reject(response.data);
  },
  (error) => {
    useLoadingStore.setState({ isLoading: false });
    return Promise.reject(error);
  },
);

// 토큰이 있는 경우
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_PEFAM_URL,
});

// 요청 보내기 전
axiosInstance.interceptors.request.use(
  (config) => {
    useLoadingStore.setState({ isLoading: true });
    const accessToken = useAuthStore.getState().accessToken;
    try {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    } catch (error) {
      useLoadingStore.setState({ isLoading: false });
      return Promise.reject(error);
    }
  },
  (error) => {
    useLoadingStore.setState({ isLoading: false });
    return Promise.reject(error);
  },
);

// 응답을 return 받기 전
axiosInstance.interceptors.response.use(
  (response) => {
    useLoadingStore.setState({ isLoading: false });
    if (response.data) {
      return response.data;
    }
    return Promise.reject(response.data);
  },
  (error) => {
    useLoadingStore.setState({ isLoading: false });
    return Promise.reject(error);
  },
);

export {baseAxiosInstanse, axiosInstance};
