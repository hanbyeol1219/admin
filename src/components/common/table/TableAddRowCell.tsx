import { useCallback, useContext, useState } from "react";
import { DataContext } from "../../../pages/List";

// MUI 사용
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AddIcon from '@mui/icons-material/Add';
import { MenuItem, Select, SelectChangeEvent, Stack, styled } from "@mui/material";

interface TableAddRowCellProps {
    setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
}

const TableAddRowCell = ({setFilteredData}: TableAddRowCellProps) => {
    const tableData = useContext(DataContext);
    const [addRowData, setAddRowData] = useState({});
    const [isAddRowVisible, setIsAddRowVisible] = useState(false); // 데이터 추가 영역

        // 새로운 row 추가 버튼
    const addTableRowButtonClickHandler = useCallback(() => {
        setIsAddRowVisible(false); // 확인 클릭하여 row 추가시 입력 행 숨기기
        setFilteredData(prevData => [...prevData, addRowData]); 
    },[isAddRowVisible, addRowData]);

    // 추가를 위해 작성한 값을 상태로 관리하기 위한 onChange함수
    const addTableRowValueChangeHandler = useCallback((e:React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, columnKey:string) => {
        setAddRowData({...addRowData, [columnKey]: e.target.value});
    },[addRowData]);

    return (
        <>
            {isAddRowVisible &&  tableData.uniqueKey &&
            <TableRow>
                {/* <FormControl> */}
                    {tableData.columns.map((column) => {
                        if(typeof tableData.tableData[0][column.key]  === "boolean"){
                            return (
                                <S.StyledTableCell align="center" key={column.key}>
                                    <Select onChange={(e: SelectChangeEvent<string>) => addTableRowValueChangeHandler(e, column.key)}>
                                        <MenuItem value="">선택안함</MenuItem>
                                        <MenuItem value="true">O</MenuItem>
                                        <MenuItem value="false">X</MenuItem>
                                    </Select>
                                </S.StyledTableCell>
                            );
                        } else {
                            return (
                                <S.StyledTableCell align="center" key={column.key}>
                                    <TextField size="small" type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => addTableRowValueChangeHandler(e, column.key)}/>
                                </S.StyledTableCell>
                            );
                        }
                    })}
                    <S.StyledTableCell>
                        <Stack direction="row" spacing={1}>
                            <S.StyledButton variant="outlined" onClick={addTableRowButtonClickHandler}>확인</S.StyledButton>
                            <S.StyledButton variant="outlined" onClick={()=>setIsAddRowVisible(false)}>취소</S.StyledButton>
                        </Stack>
                    </S.StyledTableCell>
                {/* </FormControl> */}
            </TableRow>
            }
            {!isAddRowVisible && tableData.uniqueKey && <TableRow><S.StyledTableCell  colSpan={4} align="center" style={{borderBottom: "none"}}><S.StyledButton variant="contained" onClick={()=>setIsAddRowVisible(true)}><AddIcon fontSize="small"></AddIcon>추가</S.StyledButton></S.StyledTableCell></TableRow>}
        </>
    )
}

export default TableAddRowCell;

const S = {
    StyledButton: styled(Button)(()=>({
        "&: focus": { 
            outline: "none",
        }
    })),
    StyledTableCell: styled(TableCell)(() => ({
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            padding: "5px 16px",
        },

        // 높이 고정
        maxHeight: '43px',
        minHeight: '43px',
    })),
};
