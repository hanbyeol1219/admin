import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

const OnlyNotLoggiedRoute = () => {
  const { accessToken } = useAuthStore();
  console.log("accessToken : ", accessToken);

  if (!accessToken) {
    return <Outlet />;
  } else {
    console.log("로그인 한 유저는 접근할 수 없습니다. ");
    return <Navigate to="/only-user" replace />;
  }
};

export default OnlyNotLoggiedRoute;
