import {  useContext } from "react";
import { DataContext } from "../../../pages/List";

// MUI 사용
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const TableSelectPageSize = () => {
    const tableData = useContext(DataContext);

    // 한 페이지에 보여지는 개수 변경 (5, 10, 15, 20 등)
    const pageRangeChangeHandler =(e: SelectChangeEvent) => {
        if(tableData.currentKeyword !== "" && e.target.value !== "null"){
            tableData.setTableDataValues({
                ...tableData.tableDataValues,
                size: Number(e.target.value),
            })
        } else if(tableData.currentKeyword !== "" && e.target.value === "null"){
            tableData.setTableDataValues({
                ...tableData.tableDataValues,
                size: null,
            })
        } else if(tableData.currentKeyword === "" && e.target.value === "null"){
            tableData.setTableDataValues({
                ...tableData.tableDataValues, size: null,
            })
        } else if (tableData.currentKeyword === "" && e.target.value !== "null") {
            tableData.setTableDataValues({
                page: 0,
                size: Number(e.target.value),
            });
        }
    };

    return (
        <FormControl>
            <Stack ml={1}>
                <InputLabel id="select-autowidth-label">Table Size</InputLabel>
                <Select labelId="select-autowidth-label" style={{width: 150}} label="Table Size" onChange={pageRangeChangeHandler}>
                    <MenuItem value="null">전체보기</MenuItem>
                    <MenuItem value="5">5개씩 보기</MenuItem>
                    <MenuItem value="10">10개씩 보기</MenuItem>
                    <MenuItem value="15">15개씩 보기</MenuItem>
                    <MenuItem value="20">20개씩 보기</MenuItem>
                </Select>
            </Stack>
        </FormControl>
    )
}

export default TableSelectPageSize;