import {  useContext, useRef } from "react";
import { DataContext } from "../../../pages/List";
import { Stack, styled } from "@mui/material";

const TablePaging =() => {
    const tableData = useContext(DataContext);
    const currentPage = useRef<number>(tableData.tableDataValues.page);

    // 페이지 버튼 클릭 시
    // useCallback을 사용하여 pageButtonClickHandler 함수를 메모이제이션하고,
    // 이 함수 내에서 이전 페이지 값과 현재 페이지 값이 동일한지 확인하여 setTableDataValues 함수를 호출
    const pageButtonClickHandler = (page: number) => {
        if (page !== currentPage.current) {
            tableData.setTableDataValues({
                ...tableData.tableDataValues, page,
            });
            currentPage.current = page;
        }
    };

    return (
        <S.StyledStack direction={"row"}>
            {/* props로 넘겨받은 totalCount를 size로 나눈 몫으로 페이지 처리 */}
            {(() => {
                const pages = [];
                // 나머지가 있는 경우 올림 처리로 한 페이지를 더 생성하기 위해 Math.ceil 사용
                for(let i = 1; i <= Math.ceil(tableData.totalDataCount/tableData.tableDataValues.size!); i++){
                    pages.push(i);
                }
                const slicePageButtonArr = pages.slice(0, 1*tableData.tableDataValues.size);
                console.log(slicePageButtonArr);
                return pages.map((page) => {
                    return(
                        <button key={page} onClick={()=>pageButtonClickHandler(page-1)}>{page}</button>
                    )
                })
            })()}
        </S.StyledStack>
    )
}

export default TablePaging;

const S = {
    StyledStack: styled(Stack)({
        width: '100%',
    }),
}