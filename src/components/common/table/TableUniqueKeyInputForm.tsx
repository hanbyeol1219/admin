import { useCallback, useContext, useState } from "react";
import { DataContext } from "../../../pages/List";

// MUI 사용
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from "@mui/material";
    
const TableUniqueKeyInputForm = () => {
    const tableData = useContext(DataContext);
    // const [uniqueKeyValue, setUniqueKeyValue] = useState(tableData.uniqueKey);
    const [uniqueKeyValue, setUniqueKeyValue] = useState("userId");

    const uniqueKeySubmitButtonClickHandler = useCallback(() => {
        tableData.setUniqueKey(uniqueKeyValue);
    },[uniqueKeyValue]);
    
    return (
        <>
            <FormControl onSubmit={(e)=>e.preventDefault()}>
                <Stack direction="row" spacing={1} ml={1}>
                    <TextField required label="Unique Key" type="text" value={uniqueKeyValue} onChange={(e)=>setUniqueKeyValue(e.target.value)}/>
                    <S.StyledButton variant="outlined" onClick={uniqueKeySubmitButtonClickHandler}>확인</S.StyledButton>
                </Stack>
            </FormControl>
        </> 
    );
}

export default TableUniqueKeyInputForm; 

const S = {
    StyledButton: styled(Button)(()=>({
        "&: focus": { 
            outline: "none",
        }
    }))
};
