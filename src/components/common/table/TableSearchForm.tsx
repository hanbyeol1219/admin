import { useContext, useRef, useState } from "react";
import { DataContext } from "../../../pages/List";

// MUI 사용
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const TableSearchForm = ()=> {
    const [searchCategory, setSearchCategory] = useState(''); // 검색 카테고리 관리
    const [keyword, setKeyword] = useState(''); // 검색어 관리
    const tableData = useContext(DataContext);

    const currrentSearchCategoryRef = useRef(searchCategory);
    const currrentKeywordRef = useRef(keyword);

    const handleChange = (e: SelectChangeEvent) => {
        setSearchCategory(e.target.value);
    }

    // 검색 버튼
    const searchButtonClickHandler = () => {
        if (currrentSearchCategoryRef.current === searchCategory && currrentKeywordRef.current === keyword) {
        //     // 값이 변하지 않았다면 함수를 종료
            return;
        }
        currrentSearchCategoryRef.current = searchCategory;
        currrentKeywordRef.current = keyword;

        // 아무런 필터링도 적용되지 않았을 경우 다시 전체 데이터를 불러온다.
        if(searchCategory ==="" && keyword ==="" && tableData.tableDataValues.size === null){
            tableData.setTableDataValues({
                ...tableData.initialTableDataValue,
                page: 0,
                size: null,
            })
            tableData.setCurrentKeyword("");
        } 
        // 전체 카테고리에서 키워드 검색 시 .. keyword에 keyword를 넣어준다...
        // 내가 keyword에 담아서 던져준 값으로 필터링해서 결과 데이터를 다시 주는건 서버에서 처리..
        // keyword라는 key값은 임의로 지정한 것.
        else if(searchCategory === "all" && keyword !== "") {
            tableData.setTableDataValues({
                ...tableData.initialTableDataValue,
                size: tableData.tableDataValues.size,
                keyword: keyword,
            })
            tableData.setCurrentKeyword(keyword);
        } 
        // 카테고리는 선택되었는데 키워드는 없이 검색했을 경우
        else if(searchCategory !== "" && keyword === "") {
            tableData.setTableDataValues({
                ...tableData.initialTableDataValue,
            })
            tableData.setCurrentKeyword("");
        }
        // 이 안에서..내가 setTableDataValues안에 특정 key 값을 작성하지 않아도
        // tableData로 가지고있는 columns의 key값을 이용하여 작동되도록 ..
        else {
            tableData.setTableDataValues({
                ...tableData.initialTableDataValue,
                size: tableData.tableDataValues.size,
                [searchCategory]: keyword
            })
            tableData.setCurrentKeyword(keyword);
        }
    };

    return (
        <>
            <FormControl onSubmit={(e)=>e.preventDefault()}>
                <Stack direction="row" spacing={1}>
                    <InputLabel id="select-autowidth-label">Category</InputLabel>
                    <Select labelId="select-autowidth-label" style={{width: 150}} label="Category" onChange={handleChange}>
                        <MenuItem value="all">전체</MenuItem>
                        {tableData.columns.map((column) => {
                            // data가 있고 그 data의 길이가 0보다 크고 column의 key값이 boolean이 아닐 경우에만 option으로 보여주기
                            // if(tableData.tableData && tableData.tableData.length > 0 && typeof tableData.tableData[0][column.key] !== "boolean"){
                                return(
                                    <MenuItem key={column.key} value={column.key}>{column.title}</MenuItem>
                                )
                            // }
                        })}
                    </Select>
                    <TextField required label="Search Keyword" fullWidth type="text" style = {{width: 200}} value={keyword} onChange={(e)=>setKeyword(e.target.value)}/>
                    <Button variant="outlined" onClick={searchButtonClickHandler}>검색</Button>
                </Stack>
            </FormControl>
        </>
    )
}

export default TableSearchForm;