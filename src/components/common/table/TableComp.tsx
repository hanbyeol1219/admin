import React, { useContext, useEffect, useState } from "react";
import FilterModal from "../../../common/modal/FilterModal";
import TableSearchForm from "./TableSearchForm";
import { DataContext } from "../../../pages/List";
import TableTbodyCell from "./TableTbodyCell";
import TableAddRowCell from "./TableAddRowCell";
import TableAPIURLInputForm from "./TableAPIURLInputForm";
import TableUniqueKeyInputForm from "./TableUniqueKeyInputForm";

// MUI 사용
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Box, Button, Collapse, IconButton, TableFooter, TablePagination, styled } from "@mui/material";
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import ArrowDownwardSharpIcon from '@mui/icons-material/ArrowDownwardSharp';
import CloseIcon from '@mui/icons-material/Close';
// MUI - Table 관련
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useTheme } from "@mui/material/styles";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

/**
 * @param {Object} columns : 헤더 목록
 * @param {Object} data : api로 받아온 데이터
 * @param {Object} tableDataValues : 페이지 및 페이지 별 데이터 갯수 정보
 * @param {Function} setTableDataValues : 페이지 및 페이지 별 데이터 갯수 정보 변경 함수
 * @param {number} totalCount : 전체 데이터 갯수
 * @returns {JSX.Element} : 테이블 컴포넌트
 */

interface TableProps {
    location?: any;
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }
  
  const TablePaginationActions = (props: TablePaginationActionsProps) => {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

const TableComp = ({location}: TableProps) => {
    const tableData = useContext(DataContext);
    const [filteredData, setFilteredData] = useState(tableData.tableData); // 필터링 된 데이터 관리
    const [sortStatus, setSortStatus] = useState(false); // 정렬에 대한 상태 관리
    const [filterModalStates, setFilterModalStates] = useState<{[key: string]: boolean}>({}); // {isComplete: false, isCustomer: false} 모달 on/off 상태 관리
    const [filterStatus, setFilterStatus] = useState<{[key: string]: boolean | ""}>({}); // {isComplete: "O", isCustomer: "X"} 
    const [uniqueKeyInputAlertOpen, setUniqueKeyInputAlertOpen] = useState(false); // alert 상태 관리
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);

    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows =
    //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

    const handleChangePage = (
        e: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
        tableData.setTableDataValues({...tableData.tableDataValues, page: newPage});
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        tableData.setTableDataValues({...tableData.tableDataValues, size: parseInt(event.target.value, 10)});
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };    
    

    // 정렬 버튼 클릭
    const sortButtonClickHandler = (column: any) => {
        setSortStatus(!sortStatus);
        // column의 key값을 이용하여 동적으로 객체의 속성에 접근하여 데이터를 매칭한다.
        if(sortStatus){
            const result =  filteredData.sort((a, b) => {
                return a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0;
            })
            setFilteredData(result);
        } else {
            const result =  filteredData.sort((a, b) => {
                return a[column] < b[column] ? 1 : a[column] > b[column] ? -1 : 0;
            })
            setFilteredData(result);
        }
    }

    // 필터 모달 버튼
    const filterModalButtonClickHandler = (key: string) => {
        // 버튼 클릭 시 jsx 구문에서 column을 돌아서 받아온 key값으로 filterModalStates의 key값을 찾아서 true, false로 변경
        setFilterModalStates((prev)=>({
            ...prev,
            [key]: !prev[key]
        }))
    }

    // ---------------routing 관련
    const [detailPageData, setDetailPageData] = useState(location?.state);
    useEffect(()=>{
        setDetailPageData(location.state)
        console.log(location);
        console.log("detailPageData: ", detailPageData);
        if(detailPageData && location.search !== "" && tableData.uniqueKey !== "") {
            setFilteredData(detailPageData);
        } else if (location.search === ""){  
            tableData.setTableDataValues(tableData.initialTableDataValue);
        }
    }, [detailPageData, location])
    
    // 첫 렌더링 시에는 filteredData의 값이 없게끔해서 table에 값이 안보이게 하고 alert도 안띄우다가 
    // tableData.uniqueKey가 변경되거나 tableData.tableData될 경우에 
    // tableData.tableData의 모든 객체들 내부에 tableData.uniqueKey와 같은 key가 존재하는지 확인하고
    // 전부 동일하게 존재한다면 setFilteredData(tableData.tableData);
    // 존재하지 않는게 1개라도 있다면 setFilteredData([]); 하고 alert 띄우기
    // ↓
    // 1. tableData.uniqueKey가 비었을 경우에는 무조건 setFilteredData([]) 해서 데이터 안보여줄 것.
    // 2. tableData.uniqueKey값이 있다면 tableData.tableData를 for문으로 돌면서
    // 3. tableData.tableData[i][tableData.uniqueKey]가 존재하는 경우에는 해당 uniqueKey로 된 값이 있다는 것이니 uniqueKeyValueArr에 push해준다. 
    // 4. uniqueKeyValueArr의 length가 tableData.tableData.length와 같다면 모든 tableData.tableData 객체 내부에 uniqueKey값이 있었다는 것
    // 4-1. 추가로 중복값을 허용하지 않는 
    // ↓ 
    // 고려해야 할 것 .. 근데 그 값이 고유한지를 아직 작성x
    // 고유한지 확인하는 방법 : 해당 tableData.tableData[i][tableData.uniqueKey]값을 전부 배열에 넣어서 중복값 있는지 확인..

    let resultArr = [];
    useEffect(() => {
        const uniqueKeyValueArr = []; // tableData.tableData에 담긴 객체들의 uniqueKey가 key값으로 있는 모든 value를 담을 배열
        // uniqueKey가 있으면
        if(tableData.uniqueKey !== ""){ 
            // tableData.tableData를 돌면서 uniqueKey가 key값으로 있는 모든 value를 담는다.
            for(let i = 0; i < tableData.tableData.length; i++){
                if(tableData.tableData[i][tableData.uniqueKey]){
                    uniqueKeyValueArr.push(tableData.tableData[i][tableData.uniqueKey])
                }
            }
            // uniqueKeyValueArr에 담긴 값이 정말 모두 고유한 값으로 사용할 수 있는지 확인하기 위해 Set 객체에 담는다
            const uniqueKeyValueArrSet = new Set(uniqueKeyValueArr);
            // 조건문을 통해 length와 size를 비교하여 중복된 값이 없었는지 tableData.tableData의 길이만큼 uniqueKeyValueArr가 돌았는지 확인
            if(uniqueKeyValueArr.length === tableData.tableData.length  && uniqueKeyValueArrSet.size === uniqueKeyValueArr.length){
                // 조건이 true이면 setFilteredData에 api 통신으로 불러온 값 할당
                setFilteredData(tableData.tableData.sort((a, b) => (a[tableData.columns[0].key] < b[tableData.columns[0].key] ? -1 : 1)));

                //a의 calories 말고 내가 가진 tableData의 columns의 key값을 이용해서 정렬해야함
                resultArr = tableData.tableData;
            } else { // 입력했던 고유값을 uniqueKey로 사용할 수 없다면
                // 다시 전체 값을 불러오고 
                tableData.setTableDataValues(tableData.initialTableDataValue);
                alert("고유키로 사용할 수 없는 값입니다. 다시 입력해주세요.");
                // <Alert severity="warning">고유키로 사용할 수 없는 값입니다. 다시 입력해주세요.</Alert>
                tableData.setUniqueKey("") // 고유값도 다시 비워주고
                filteredData.length>0 && setFilteredData([]) // 원래 filteredData에 값이 있었다면 비워준다.
                return;
            }
        } 
        // uniqueKey가 없으면서 tableData의 값도 없다면
        else if(tableData.uniqueKey === "" && tableData.tableData.length === 0){
            // 다시 전체값을 불러오고
            tableData.setTableDataValues(tableData.initialTableDataValue); 
            setTimeout(()=>{
                setUniqueKeyInputAlertOpen(true);
                // alert("고유키를 입력해주세요.");
            }, 700)
            filteredData.length>0 && setFilteredData([]) // filteredData에 들어있던 값이 있다면 비워준다.
        }
    }, [tableData.uniqueKey, tableData.tableData]); 

    useEffect(()=>{
        console.log("tableData.uniqueKey : ", tableData.uniqueKey)
    }, [])

    // 필터
    useEffect(() => { 
        console.log("tableData.tableData : ", tableData.tableData)
        if(tableData.uniqueKey !== "" && resultArr.length > 0){
            let result = filteredData;
            // filterStatus에서 key값을 돌면서 해당 값이 ""이 아닌 경우 result를 돌면서 row에 해당 key의 값이
            // filterStatus의 key값과 같은 경우에만 return
            if (filteredData.length > 0) {
                for (let key in filterStatus) {
                    if (filterStatus[key] !== "") {
                        result = result.filter((row) => { // Explicitly define the type of the row parameter
                            // return row[key as keyof TableDataListProps] === filterStatus[key];
                            return row[key] === filterStatus[key];
                        });
                    }
                }
            }
            // setFilteredData(result); 
        }
    }, [tableData.tableData, filterStatus]);

    // 페이지 변경 관련 코드
    

    return (
        <> 
            <Collapse in={uniqueKeyInputAlertOpen}>
                <Alert severity="warning" action={<IconButton onClick={()=>{setUniqueKeyInputAlertOpen(false)}}><CloseIcon></CloseIcon></IconButton>}>고유키를 입력해주세요.</Alert>
            </Collapse>
            <Stack mb={3} mt={3} direction="row">
                {/* API URL 입력 FORM */}
                <TableAPIURLInputForm setFilteredData={setFilteredData}/>
                
                {/* Table map에 사용 될 고유 key값 입력 */}
                <TableUniqueKeyInputForm />
            
                {/* 검색 */}
                <TableSearchForm/>

                {/* 페이지 사이즈를 선택하는 select 박스 */}
                {/* <TableSelectPageSize/> */}
            </Stack>

            {/* 테이블 영역 */}
            <S.StyledStack>
                    <Table style={{"minHeight" : "78vh"}} stickyHeader>
                        <TableHead>
                            <TableRow>
                                {/* columns 객체를 돌면서 title 값을 뿌린다. */}
                                {tableData.columns.map((column) => {
                                    return(
                                        <S.StyledTableCell align="center" key={column.key}>{column.title}
                                        {/* 각 column에 속하는 값의 type을 확인해서 boolean인 경우에는 필터 버튼을 보여주고
                                        boolean이 아닐 경우에는 정렬할 수 있는 값이라 판단하여 sort 할 수 있는 버튼을 보여준다. */}
                                        {filteredData.length > 0 && typeof filteredData[0][column.key] !== "boolean" &&
                                            <>
                                                <S.StyledButton onClick={()=>sortButtonClickHandler(column.key)}>{sortStatus ? 
                                                <ArrowUpwardSharpIcon></ArrowUpwardSharpIcon> : <ArrowDownwardSharpIcon></ArrowDownwardSharpIcon>}</S.StyledButton>
                                            </>
                                        }
                                        {/* filteredData가 없어도 data 값이 존재하고 해당 column의 값의 type이 boolean이면 버튼이 보이게 */}
                                        {tableData.tableData.length > 0 && typeof tableData.tableData[0][column.key] === "boolean" &&
                                            <>
                                                {/* O,X 필터 걸 수 있는 체크박스 영역이 나오게끔 하는 버튼 필요 */}
                                                <S.StyledButton onClick={() => filterModalButtonClickHandler(column.key)}>filter btn</S.StyledButton>
                                            </>
                                        }
                                        </S.StyledTableCell>
                                    )
                                })}
                                <S.StyledTableCell></S.StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* filter 메소드를 통해서  */}
                            { filteredData.length > 0 ? filteredData?.map((row, index) => {
                                {/* data를 돌면서 지정한 size의 크기만큼만 보여주도록 조건문 작성 */}
                                if(tableData.tableDataValues.size !== null && index+1 <= tableData.tableDataValues.size){
                                        return <TableTbodyCell key={row[tableData.uniqueKey]} row={row} index={index} filteredData={filteredData} setFilteredData={setFilteredData}/>
                                // 사이즈 지정을 안한 경우
                                } else if(tableData.tableDataValues.size === null){
                                        return <TableTbodyCell key={row[tableData.uniqueKey]} row={row} index={index} filteredData={filteredData} setFilteredData={setFilteredData}/>                    }
                            }) : <TableRow><TableCell colSpan={tableData.columns.length+1} align="center">데이터가 없습니다.</TableCell></TableRow>}

                            {/* 데이터 추가 영역 */}
                            {/* // 동적으로 바꿔야함
                            // 1. columns의 길이만큼만 생성
                            // 2. data[0] 객체에서 column.key와 같은 key의 value값의 type을 구분해서 input, select로 구분하여 추가되도록 하기 */}
                            <TableAddRowCell setFilteredData={setFilteredData}/>
                        </TableBody>
                        <S.StyledTableFooter>
                            <TableRow>
                                <TablePagination rowsPerPageOptions={[{ label: 'All', value: null}, 5, 10, 15]}
                                colSpan={4}
                                // 전체 데이터 개수 → 9464
                                count={tableData.totalDataCount}
                                // 한 페이지에 보여줄 데이터 개수 
                                // 전체보기.....? 만약 전체보기(size=null)를 하면 tableData.totalDataCount 개수만큼 데이터를 넘겨준다는 가정하에 작성
                                rowsPerPage={tableData.tableDataValues.size ? tableData.tableDataValues.size : tableData.totalDataCount}
                                page={page}
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            "aria-label": "rows per page",
                                        },
                                        native: true,
                                    }
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                                ></TablePagination>
                            </TableRow>
                        </S.StyledTableFooter>
                    </Table>
            </S.StyledStack>

            {/* 페이징 버튼 영역 */}
            {/* {tableData.tableDataValues.size !== null && !detailPageData || tableData.tableDataValues.size !== null && tableData.tableData.length > detailPageData.length ? <TablePaging/> : null} */}

            {/* 임시 모달*/}
            {/* columns를 돌면서 모달 클릭 시 filterModalStates에 저장한 값 중 동일한 key를 가진 column의 정보를 담는 모달 표시 */}
            {tableData.columns.map((column) => {
                return (
                    <div key={column.key}>
                        {filterModalStates[column.key] && (
                            <div>
                                <p>{column.title} Modal</p>
                                <FilterModal setFilterStatus={setFilterStatus} columnKey={column.key}/>
                            </div>
                        )}
                    </div>
                );
            })}
        </> 
    )
}

export default TableComp;

const S = {
    StyledTableCell: styled(TableCell)(() => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#f5f5f5",
            color: "#2e2e2e",
            padding: "5px 16px",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            padding: "5px 16px",
        },
        height: '43px',
    })),
    StyledButton: styled(Button)(()=>({
        "&: focus": { 
            outline: "none",
        },
        "&: hover": { 
            backgroundColor: "none",
        },
    })),
    StyledTableFooter: styled(TableFooter)(() => ({
        "& .MuiTablePagination-root": {
            justifyContent: "center",
        },
        position: "sticky",
        bottom: 0,
        backgroundColor: "#f5f5f5",
    })),
    StyledStack: styled(Stack)({
        height: "78vh",
        overflow: "scroll",
        overflowX: "hidden",
        paddingRight: "5px",

        "&::-webkit-scrollbar": {
            width: "12px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d8d8d8",
            borderRadius: "10px",
            backgroundClip: "padding-box",
            border: "2px solid transparent",
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "#f3f3f3",
            borderRadius: "10px",
        },
    }),
};
