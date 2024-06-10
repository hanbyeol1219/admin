import { useNavigate } from "react-router-dom";
import { getAccountData } from "../apis/Auth";
import { useAuthStore } from "../store/AuthStore";
import { useEffect } from "react";
import { useErrorStore } from "../store/ErrorStore";
import { Button, Stack, styled } from "@mui/material";

const OnlyUser = () => {
  const navigate = useNavigate();
  const { changeAccessToken } = useAuthStore();
  const { changeErrorStatus } = useErrorStore();
  
  // token 전역 관리 설정
  const logoutButtonClickHandler = () => {
    navigate("/");
    localStorage.removeItem("access-token");
    changeAccessToken("");
  };

  const getAllAccountData = async () => {
    await getAccountData().catch((error) => {
      console.log("error: ", error);
      changeErrorStatus(error.response.status);
      navigate("*");
    });
  };

  useEffect(() => {
    getAllAccountData();
  }, []);

  return (
    <S.StyledStack>
      <p>회원에게만 보여지는 페이지입니다.</p>
      <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
        <Button variant="outlined" onClick={logoutButtonClickHandler}>로그아웃</Button>
        <Button variant="outlined" onClick={()=> navigate('/list')}>사용자 목록 확인</Button>
        {/* <Button variant="outlined" onClick={()=> navigate('/test')}>테스트용 사용자 목록 확인</Button> */}
      </Stack>
    </S.StyledStack>
  );
};

const S = {
  StyledStack: styled(Stack)({
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}),
};

export default OnlyUser;
