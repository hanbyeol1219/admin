import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuthStore } from "../store/AuthStore";
import { login } from "../apis/Auth";
import { errorMessage } from "../common/error";

const Login = () => {
  const [id, setId] = useState("test@test.com");
  const [password, setPassword] = useState("test");
  const navigate = useNavigate();
  // token 전역 관리 설정을 위한 선언
  const { changeAccessToken } = useAuthStore();

  // 로그인 버튼 클릭 시
  const loginButtonClickHandler = () => {
    login({ id, password })
      .then((data) => {
        if (data.data === null) {
          errorMessage(data.message);
        } else {
          console.log("로그인 성공 ", data);
          changeAccessToken(data.data.token);
          navigate("/only-user");
        }
      })
      .catch((error) => {
        console.log("로그인 실패 ", error);
        navigate("/only-user");
      });
  };

  return (
    <>
      <S.Form onSubmit={(e) => e.preventDefault()}>
        <S.InputWrap>
          <S.Input
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <S.Input
            placeholder="비밀번호"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </S.InputWrap>
        <S.Button onClick={loginButtonClickHandler}>로그인</S.Button>
      </S.Form>
    </>
  );
};

const S = {
  Form: styled.form`
    padding: 10px;
    background-color: #fafafa;
    display: flex;
    flex-direction: column;
  `,
  InputWrap: styled.div`
    display: flex;
    flex-direction: column;
  `,
  Input: styled.input`
    margin: 5px;
    padding: 0 5px;
    width: 200px;
    height: 30px;
    box-sizing: border-box;
  `,
  Button: styled.button`
        width: 200px
        height: 30px;
        background-color: #424242;
        border-radius: 5px;
        padding: 5px;
        margin: 5px;
        color: #ffffff;
        box-sizing: border-box;
    `,
};

export default Login;
