import { useCallback, useContext, useEffect, useState } from "react";
import { getTableData } from "../../../apis/Table";
import { DataContext } from "../../../pages/List";

// MUI 사용
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from "@mui/material";

interface TableAPIURLInputFormProps {
    setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
}

const TableAPIURLInputForm = ({setFilteredData}: TableAPIURLInputFormProps) => {
    const tableData = useContext(DataContext);
    const tableDataValues = tableData.tableDataValues;
    const [APIURLValue, setAPIURLValue] = useState('/api/v1/admin/user/clients');

    const APIURLInputValutOnChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setAPIURLValue(e.target.value);
    },[APIURLValue]);

    const getAllTableData =  async () => {
        await getTableData({tableDataValues, APIURLValue}).then((data)=>{
            console.log(data)
            tableData.setTableData(data.content);
            tableData.setTotalDataCount(data.totalElements);
            tableData.setTotalDataPages(data.totalPages);
        }
        ).catch((error)=>{
            console.log("error: ", error);
            tableData.setTableData([]);
            setFilteredData([]);
        })
    }
    
    const APIURLSubmitButtonClickHandler = useCallback(() => {
        getAllTableData();
    },[]);

    useEffect(()=>{
        getAllTableData();
    },[tableData.tableDataValues]);
    
    return (
        <>
            <FormControl onSubmit={(e)=>e.preventDefault()}>
                <Stack direction="row" spacing={1}>
                    <TextField required type="text" label="API URL" value={APIURLValue} onChange={APIURLInputValutOnChangeHandler} />
                    <S.StyledButton variant="outlined" onClick={APIURLSubmitButtonClickHandler}>확인</S.StyledButton>
                </Stack>
            </FormControl>
        </>
    );
    }

    export default TableAPIURLInputForm;

    const S = {
        StyledButton: styled(Button)(()=>({
            "&: focus": { 
                outline: "none",
            }
        }))
    };
    