import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

const OnlyLoggiedRoute = () => {
  const { accessToken } = useAuthStore();

  if (accessToken) {
    return <Outlet />;
  } else {
    console.log("로그인이 필요합니다.");
    return <Navigate to="/login" replace />;
  }
};

export default OnlyLoggiedRoute;
