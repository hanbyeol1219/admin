import { Button, Stack, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    return (
        <S.StyledStack spacing={1} direction="row">
                <S.StyledButton variant="outlined" onClick={()=>navigate('/join')}>회원가입 페이지 이동</S.StyledButton>
                <S.StyledButton variant="outlined" onClick={()=>navigate('/login')}>로그인 페이지 이동</S.StyledButton>
                <S.StyledButton variant="outlined" onClick={()=>navigate('/only-user')}>회원 전용 페이지 이동</S.StyledButton>
        </S.StyledStack>
    )
}

export default Home;

const S = {
    StyledStack: styled(Stack)({
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }),
    StyledButton: styled(Button)({
        minWidth: "140px",
        "&: focus": { 
            outline: "none",
        },
    }),
}