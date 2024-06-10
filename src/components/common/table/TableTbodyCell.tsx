import React, { useCallback, useContext, useState } from "react";
import { DataContext } from "../../../pages/List";
import { useNavigate } from "react-router-dom";

// MUI 사용
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Button, MenuItem, Select, SelectChangeEvent, TextField, styled } from "@mui/material";

interface TableTbodyCellProps {
    row: any;
    index: number;
    filteredData: any[];
    setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
}

const TableTbodyCell = ({row, index,filteredData, setFilteredData} : TableTbodyCellProps) => {
    const navigate = useNavigate();

    const tableData = useContext(DataContext);

    const [editRowData, setEditRowData] = useState({});
    const [isEditRowVisible, setIsEditRowVisible] = useState(false);
    const [currentEditRow, setCurrentEditRow] = useState<number | null>(null);

        // 수정 버튼 클릭 시
    const changeEditFormButtonClickHandler = useCallback((index: number | null, row: any) => {
        setIsEditRowVisible(true);
        setCurrentEditRow(index);
        setEditRowData(row);
    },[currentEditRow])

    // 수정을 위해 작성한 값을 상태로 관리하기 위한 onChange함수
    const editTableRowValueChangeHandler = useCallback((e:React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, columnKey:string) => {
        setEditRowData({...editRowData, [columnKey]: e.target.value});
        console.log("editRowData: ", editRowData)
        console.log("columnKey: ", columnKey)
        console.log("e.target.value: ", e.target.value)
    },[editRowData]);

    // 수정 후 확인 버튼 클릭 시
    const editTableRowButtonClickHandler = useCallback((uniqueKey: string) => {
        console.log("editRowData: ", editRowData);
        setIsEditRowVisible(false);
        setCurrentEditRow(null);
        // 수정된 데이터를 filteredData에 반영

        if(row == editRowData){
            alert("수정된 데이터가 없습니다.");
            return;
        }
        if(row != editRowData){
            const result = filteredData.map((row) => {
                if(row[uniqueKey] === uniqueKey){
                    return editRowData;
                }
                return row;
            })
            alert("수정되었습니다.");
            setFilteredData(result);
        }
    }, [editRowData, filteredData, row]);

    const tableDataClickHandler = useCallback((row: any) => {
        navigate(`/list?detail=${row[tableData.uniqueKey]}`, {state : [row]});
    },[]);
    
    return (
        <TableRow hover key={row[tableData.uniqueKey]} style={{"height" : "43px"}}>
            {tableData.columns.map((column) => {
                if(typeof row[column.key] === "boolean"){
                    return (
                        // 수정모드 이면서 currentEditRow가 현재 index와 같은 경우 select로 보여주기
                        isEditRowVisible && currentEditRow === index ? 
                        <S.StyledTableCell align="center" key={column.key}><Select onChange={(e: SelectChangeEvent<string>)=>editTableRowValueChangeHandler(e, column.key)}>
                            {row[column.key] ? 
                            <>
                                <MenuItem value="true" selected>O</MenuItem>
                                <MenuItem value="false">X</MenuItem>
                            </>
                            : 
                            <>
                                <MenuItem value="true">O</MenuItem>
                                <MenuItem value="false" selected>X</MenuItem>
                            </>}
                        </Select></S.StyledTableCell> : <S.StyledTableCell align="center" key={column.key}>{row[column.key] ? "O" : "X"}</S.StyledTableCell>
                    );
                } else{
                    return(
                            // 수정모드 이면서 currentEditRow가 현재 index와 같은 경우 input 보여주기
                        isEditRowVisible && currentEditRow === index ? 
                        <S.StyledTableCell align="center" key={row[column.key]}><TextField size="small" defaultValue={row[column.key]} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>editTableRowValueChangeHandler(e, column.key)}/></S.StyledTableCell>
                        : <S.StyledTableCell align="center" style={{cursor: "pointer"}} onClick={()=>tableDataClickHandler(row)} key={column.key}>{row[column.key]}</S.StyledTableCell>
                    )
                }
            })}
            <S.StyledTableCell >{!isEditRowVisible && <S.StyledButton variant="outlined" onClick={()=>changeEditFormButtonClickHandler(index, row)}>수정</S.StyledButton>}
                {isEditRowVisible && <S.StyledButton variant="contained" onClick={()=>editTableRowButtonClickHandler(row[tableData.uniqueKey])}>확인</S.StyledButton>}
            </S.StyledTableCell>
        </TableRow>
    );
}

export default TableTbodyCell

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
    })),
};
