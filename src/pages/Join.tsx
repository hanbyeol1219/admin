import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { join } from "../apis/Auth";
import { Button, FormControl, Stack, TextField } from "@mui/material";

interface JoinFormProps {
    name: string;
    id: string;
    password: string;
    phone: string;
}

const Join = () => {
    const initialValues: JoinFormProps = {
        name: '',
        id: '',
        password: '',
        phone: '',
    }

    const [values, setValues] = useState<JoinFormProps>(initialValues);

    // state값 하나로 관리
    const handleChange = (key: string, value: string) => {
        setValues({...values, [key]: value});
    }

    // token 전역 관리 설정
    const {changeAccessToken} = useAuthStore();

    // 회원가입 버튼 클릭 시
    const joinButtonClickHandler = () => {
        join({values}).then(data => {
            console.log("회원가입 성공", data);
            changeAccessToken(data.data.token);
        }).catch(error => {
            console.log("회원가입 실패", error);
        });
    }

    return (
        <>
            <FormControl onSubmit={(e)=>e.preventDefault()}>
                <Stack>
                    <TextField placeholder="이름" value={values.name} onChange={(e)=>handleChange("name", e.target.value)}/>
                    <TextField placeholder="아이디" value={values.id} onChange={(e)=>handleChange("id", e.target.value)}/>
                    <TextField placeholder="비밀번호" value={values.password} type="password" onChange={(e)=>handleChange("password", e.target.value)}/>
                    <TextField placeholder="핸드폰 번호" value={values.phone} onChange={(e)=>handleChange("phone", e.target.value)}/>
                </Stack>
                <Button onClick={joinButtonClickHandler}>회원가입</Button>
            </FormControl>
        </>
    )
}

export default Join;

// const S = {
//     Form: S.form`
//         padding: 10px;
//         background-color: #fafafa;
//         display: flex;
//         flex-direction: column;
//     `,
//     InputWrap: styled.div`
//         display: flex;
//         flex-direction: column;
//     `,
//     Input: styled.input`
//         margin: 5px;
//         padding: 0 5px;
//         width: 200px;
//         height: 30px;
//         box-sizing: border-box;
//     `,
//     Button: styled.button`
//         width: 200px
//         height: 30px;
//         background-color: #424242;
//         border-radius: 5px;
//         padding: 5px;
//         margin: 5px;
//         color: #ffffff;
//         box-sizing: border-box;
//     `
// }