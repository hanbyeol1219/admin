import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Join from "../pages/Join";
import Login from "../pages/Login";
import OnlyUser from "../pages/OnlyUser";
import OnlyNotLoggiedRoute from "./OnlyNotLoggiedRoute";
import OnlyLoggiedRoute from "./OnlyLoggiedRoute";
import Error from "../pages/Error";
import { useLoadingStore } from "../store/LoadingStore";
import Loading from "../common/Loading";
import TestPage from "../pages/TestPage";
import List from "../pages/List";

const Router = () => {
  const {isLoading} = useLoadingStore();
  return (
    <>
      {isLoading && <Loading />}
      {/* <MemoryRouter> */}
      <BrowserRouter>
        <Routes>
          {/* 현재는 조건없이 모두 접속 가능 */}
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Error />} />

          {/* 로그인 안한 유저만 접속 가능 */}
          <Route element={<OnlyNotLoggiedRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
          </Route>

          {/* 로그인 한 유저만 접속 가능 */}
          <Route element={<OnlyLoggiedRoute />}>
            <Route path="/only-user" element={<OnlyUser />} />
            <Route path="/list" element={<List />} />
            <Route path="/list?detail=:id" element={<List />} />
            <Route path="/test" element={<TestPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* </MemoryRouter> */}
    </>
  );
};

export default Router;
