import React, { useEffect, useState } from "react";
import FilterModal from "../../../common/modal/FilterModal";

interface TableProps {
    columns: 
    {
        key: string;
        title: string;
    }[];
    data: any[];
    userDataValues: {
        page: number;
        size: number | null;
        name: string | null;
        address: string | null;
        phone: string | null;
    }
    setUserDataValues: React.Dispatch<React.SetStateAction<{
        page: number;
        size: number | null;
        name: string | null;
        address: string | null;
        phone: string | null;
    }>>;
    totalCount: number;
}

/**
 * @param {Object} columns : 헤더 목록
 * @param {Object} data : api로 받아온 데이터
 * @param {Object} userDataValues : 페이지 및 페이지 별 데이터 갯수 정보
 * @param {Function} setUserDataValues : 페이지 및 페이지 별 데이터 갯수 정보 변경 함수
 * @param {number} totalCount : 전체 데이터 갯수
 * @returns {JSX.Element} : 테이블 컴포넌트
 */

const Table = ({columns, data, userDataValues, setUserDataValues, totalCount}: TableProps) => {
    const [keyword, setKeyword] = useState(''); // 검색어 관리
    const [searchCategory, setSearchCategory] = useState(''); // 검색 카테고리 관리
    const [originalData, setOriginalData] = useState(data); // api로 넘어온 데이터 필터링 전 상태
    const [filteredData, setFilteredData] = useState(data); // 필터링 된 데이터 관리
    const [_, setSortStatus] = useState("descending"); // 정렬에 대한 상태 관리
    const [filterModalStates, setFilterModalStates] = useState<{[key: string]: boolean}>({}); // {isComplete: false, isCustomer: false} 모달 on/off 상태 관리
    const [filterStatus, setFilterStatus] = useState<{[key: string]: boolean | ""}>({}); // {isComplete: "O", isCustomer: "X"} 
    const [isAddRowVisible, setIsAddRowVisible] = useState(false); // 데이터 추가 영역 
    const [addRowData, setAddRowData] = useState({});
    const [isEditRowVisible, setIsEditRowVisible] = useState(false);

    // 중복되는 jsx를 함수로 만들어서 사용
    // 필터 끝나면 작업 할 것------------!

    // 페이지 보여지는 갯수 변경
    const pageRangeChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilteredData([]);
        if(e.target.value === "null"){
            setUserDataValues({
                ...userDataValues, size: null,
            })
            console.log("내가 선택한 데이터 갯수 : ", userDataValues.size)
        } else {
            setUserDataValues({
                ...userDataValues, size: Number(e.target.value),
            });
        }
    }

    // 페이지 버튼 클릭 시
    const pageButtonClickHandler = (page: number) => {
        console.log("클릭한 페이지 번호: ", page);
        setUserDataValues({
            ...userDataValues, page,
        })
        console.log("userDataValues: ", userDataValues);
    }

    // 검색 버튼
    const searchButtonClickHandler = () => {
        // let result = originalData;
        // // 검색 카테고리가 전체일 경우
        // if(searchCategory === ""){ 
        //     result = result.filter((row) => {
        //         const rowFilteredArr:any[] = [];
        //         // row의 객체 내부의 value값이 boolean type일 경우 해당 column은 검색 대상에서 제외
        //         Object.values(row).forEach((value) => {
        //             if(typeof value !== "boolean"){
        //                 rowFilteredArr.push(value);
        //             }
        //         });
        //         // row의 모든 value 값을 배열로 만들어서 join으로 하나의 문자열로 만든 후 
        //         // 그 문자열에 keyword가 포함되어 있는지 확인하여 result에 담는다.
        //         return Object.values(rowFilteredArr).join('').toLowerCase().includes(keyword);
        //     })
        
        // 내가 선택한 카테고리와 동일한 key를 가진 value에만 keyword를 넣을 수 없을까?
        if(searchCategory === "") {
            setUserDataValues({
                ...userDataValues,
                name: keyword,
                address: keyword,
                phone: keyword
            })
        } else {
            setUserDataValues({
                ...userDataValues,
                [searchCategory]: keyword
            })
        }

        // 대소문자 구분 없는 검색을 위해 keyword를 소문자로 변경
        // const lowerCaseKeyword = keyword.toLowerCase();
        // 검색 카테고리가 전체일 경우
        // if(searchCategory === ""){
        //     // reslut를 돌면서 row의 value값이 boolean이 아닌 경우와 key값이 columns에 있는 경우에만 return
        //     result = result.filter((row) => {
        //         // row 객체 내부의 key를 다 가지고와서 배열로 만든 후 하나씩 돌면서 필터링
        //         return Object.keys(row).filter((key) => {
        //             // columns를 map으로 돌리면서 column의 key값을 row의 key값과 비교하여 포함하고(=같으면) 있으면 해당 key를 return
        //             return columns.map((column) => {
        //                 return column.key;
        //             }).includes(key);
        //         }).map((key) => { // columns배열에 해당 key가 있다면 그 key를 가진 값들을 join으로 합치고 소문자로 변경 후 lowerCaseKeyword를 포함하는지 확인하여 반환 
        //             // O,X 값이 true, false로 검색되는 문제 해결을 위해 boolean type은 검색 대상에서 걸러준다.
        //             if (typeof row[key] !== "boolean") {
        //                 return row[key];
        //             }
        //     }).join('').toLowerCase().includes(lowerCaseKeyword);
        //     })

        // } 
        // // 검색 카테고리가 선택 된 경우
        // else {
        //     result = result.filter((row) => {
        //         return row[searchCategory].toLowerCase().includes(lowerCaseKeyword);
        //     })
        // }

        // 필터
        // filterStatus에서 key값을 돌면서 해당 값이 ""이 아닌 경우 result를 돌면서 row에 해당 key의 값이 filterStatus의 key값과 같은 경우에만 return
        // for (let key in filterStatus) {
        //     if (filterStatus[key] !== "") {
        //         result = result.filter((row) => {
        //             return row[key] === filterStatus[key];
        //         });
        //     }
        // }
        // setFilteredData(result);
    }

    // 오름차순 버튼
    const ascendingSortButtonClickHandler = (column: string) => {
        // column의 key값을 이용하여 동적으로 객체의 속성에 접근하여 데이터를 매칭한다.
        const result = filteredData.sort((a, b) => {
            if(a[column] > b[column]){
                return 1; // 뒤로 밀림
            }
            if(a[column] < b[column]){
                return -1; // 자리 유지
            }
            return 0;
        })
        setSortStatus("ascending");
        setFilteredData(result);
    }

    // 내림차순 버튼
    const descendingSortButtonClickHandler = (column: string) => {
        const result = filteredData.sort((a, b) => {
            if(a[column] < b[column]){
                return 1;
            }
            if(a[column] > b[column]){
                return -1;
            }
            return 0;
        })
        setSortStatus("descending");
        setFilteredData(result);
    };

    // 필터 모달 버튼
    const filterModalButtonClickHandler = (key: string) => {
        // 버튼 클릭 시 jsx 구문에서 column을 돌아서 받아온 key값으로 filterModalStates의 key값을 찾아서 true, false로 변경
        setFilterModalStates((prev)=>({
            ...prev,
            [key]: !prev[key]
        }))
    }

    // 새로운 row 추가 버튼
    const addTableRowButtonClickHandler = () => {
        // row가 추가될 때 columns의 길이만큼만 입력을 위한 input이나 select가 추가되면서
        // columns를 돌면서 column의 value값의 type을 구분해서 input, select, button을 만들어서 추가되도록 하기
        // api 통신도..
        setIsAddRowVisible(false); // 확인 클릭하여 row 추가시 입력 행 숨기기
        setFilteredData(prevData => [...prevData, addRowData]);
    }

    // 추가를 위해 작성한 값을 상태로 관리하기 위한 onChange함수
    const addTableRowValueChangeHandler = (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, columnKey:string) => {
        setAddRowData({...addRowData, [columnKey]: e.target.value});
    }

    // 수정 버튼 클릭 시
    const editTableRowButtonClickHandler = (index: number) => {
        console.log(`${index+1}번째 데이터 수정 버튼 클릭!`);
        setIsEditRowVisible(false);

    }

    // 검색과 필터의 데이터가 엮여있어야 한다고 판단
    // 검색과 필터를 동시에 적용하여 setFilteredData에 보내고 그 데이터를 뿌린다..
    // 현재 문제 : 1. 검색했다가 다시 검색어를 없애고 검색을 눌러 전체 데이터를 보여줄 때 필터는 걸려있음에도 전체 데이터가 보여진다.
    //            2. 어차피 검색 버튼에 onClick을 해서 검색을 해야하는데 여기(useEffect)에 넣어놓으면 뭐하나..?
    // useEffect(() => {
    //     let result = originalData;
    
        // // 검색 → 이 부분을 여기에 작성함으로써 filterStatus가 바뀔 때마다 검색도 동시에 이루어짐,, 이게 맞나?
        // const lowerCaseKeyword = keyword.toLowerCase();

        // // 검색 카테고리가 전체일 경우
        // if(searchCategory === ""){
        //     // column의 key값을 가지고 있지 않아도 모든 데이터를 검색할 수 있도록 작성
        //     result = result.filter((row) => {
        //         const rowFilteredArr:any[] = [];
        //         // row의 객체 내부의 value값이 boolean type일 경우 해당 column은 검색 대상에서 제외
        //         Object.values(row).forEach((value) => {
        //             if(typeof value !== "boolean"){
        //                 rowFilteredArr.push(value);
        //             }
        //         });
        //         // row의 모든 value 값을 배열로 만들어서 join으로 하나의 문자열로 만든 후 
        //         // 그 문자열에 keyword가 포함되어 있는지 확인하여 result에 담는다.
        //         return Object.values(rowFilteredArr).join('').toLowerCase().includes(lowerCaseKeyword);
        //     })
        // } else {
        //     // 검색 카테고리가 있을 경우 row에서 선택한 카테고리의 값을 찾아서 includes 되어있으면 return
        //     result = result.filter((row) => {
        //         return row[searchCategory].toLowerCase().includes(lowerCaseKeyword);
        //     });
        // }
    
        // 필터
        // filterStatus에서 key값을 돌면서 해당 값이 ""이 아닌 경우 result를 돌면서 row에 해당 key의 값이
        // filterStatus의 key값과 같은 경우에만 return
    //     if(filteredData.length > 0 ) {
    //         for (let key in filterStatus) {
    //             if (filterStatus[key] !== "") {
    //                 result = result.filter((row) => {
    //                     return row[key] === filterStatus[key];
    //                 });
    //             }
    //         }
    //     }

    //     setFilteredData(result);
    // }, [data, filterStatus, searchCategory]);

    useEffect(()=>{
        console.log("data: ", data);
        setOriginalData(data);
        setFilteredData(data);
    }, [data])
    
    return (
        <> 
            {/* 검색 */}
            <form onSubmit={(e)=>e.preventDefault()}>
                <select onChange={(e)=>setSearchCategory(e.target.value)}>
                    <option value="">전체</option>
                    {columns.map((column) => {
                        // data가 있고 그 data의 길이가 0보다 크고 column의 key값이 boolean이 아닐 경우에만 option으로 보여주기
                        if(data && data.length > 0 && typeof data[0][column.key] !== "boolean"){
                            return(
                                <option key={column.key} value={column.key}>{column.title}</option>
                            )
                        }
                    })}
                </select>
                <input type="text" placeholder="검색어를 입력하세요." value={keyword} onChange={(e)=>setKeyword(e.target.value)}/>
                <button onClick={searchButtonClickHandler}>검색</button>
            </form>

            {/* 페이지 사이즈를 선택하는 select 박스 */}
            <select onChange={(e)=>pageRangeChangeHandler(e)}>
                <option value="null">전체보기</option>
                <option value="5">5개씩 보기</option>
                <option value="10">10개씩 보기</option>
                <option value="15">15개씩 보기</option>
            </select>

            {/* 테이블 영역 */}
            <table>
                <thead>
                    <tr>
                        {/* columns 객체를 돌면서 title 값을 뿌린다. */}
                        {columns.map((column) => {
                            return(
                                <th key={column.key}>{column.title}
                                {/* 각 column에 속하는 값의 type을 확인해서 boolean인 경우에는 필터 버튼을 보여주고
                                boolean이 아닐 경우에는 정렬할 수 있는 값이라 판단하여 sort 할 수 있는 버튼을 보여준다. */}
                                {filteredData.length > 0 && typeof filteredData[0][column.key] !== "boolean" &&
                                    <>
                                        <button onClick={()=>ascendingSortButtonClickHandler(column.key)}>↑</button>
                                        <button onClick={()=>descendingSortButtonClickHandler(column.key)}>↓</button>
                                    </>
                                }
                                {/* filteredData가 없어도 data 값이 존재하고 해당 column의 값의 type이 boolean이면 버튼이 보이게 */}
                                {data.length > 0 && typeof data[0][column.key] === "boolean" &&
                                    <>
                                    {/* O,X 필터 걸 수 있는 체크박스 영역이 나오게끔 하는 버튼 필요 */}
                                    <button onClick={() => filterModalButtonClickHandler(column.key)}>filter btn</button>
                                </>
                                }
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {/* filter 메소드를 통해서  */}
                    {data && filteredData.length > 0 ? filteredData?.map((row, index) => {
                        {/* data를 돌면서 지정한 size의 크기만큼만 보여주도록 if문 작성 */}
                        if(userDataValues.size !== null && index+1 <= userDataValues.size){
                            return (
                               <tr key={row.userId}>
                                   {columns.map((column) => {
                                    // boolean 타입의 데이터는 true나 false로 넘어오기 때문에 O,X로 표시
                                       if(typeof row[column.key] === "boolean"){
                                            return (
                                                // 수정 모드가 아니면
                                                !isEditRowVisible ? 
                                                    <td key={column.key}>{row[column.key] ? "O" : "X"}</td>
                                                // 수정 모드이면
                                                : <td><select>
                                                        <option value="true">O</option>
                                                        <option value="false">X</option>
                                                  </select></td>
                                            );
                                        } else{
                                            return (
                                                isEditRowVisible ? <td><input value={row[column.key]}/></td> : <td key={column.key}>{row[column.key]}</td>
                                            );
                                        }
                                   })}
                                   <td>{!isEditRowVisible && <button onClick={()=>setIsEditRowVisible(true)}>수정</button>}
                                       {isEditRowVisible && <button onClick={()=>editTableRowButtonClickHandler(index)}>확인</button>}
                                   </td>
                               </tr>
                           );
                        } else if(userDataValues.size === null){
                            return (
                                <tr key={row.address}>
                                    {columns.map((column) => {
                                        if(typeof row[column.key] === "boolean"){
                                            return (
                                                <td key={column.key}>{row[column.key] ? "O" : "X"}</td>
                                            );
                                        } else{
                                            return (
                                                <td key={column.key}>{row[column.key]}</td>
                                            );
                                        }
                                    })}
                                    <td>{!isEditRowVisible && <button onClick={()=>setIsEditRowVisible(true)}>수정</button>}
                                        {isEditRowVisible && <button onClick={()=>editTableRowButtonClickHandler(index)}>확인</button>}
                                   </td>
                                </tr>
                            );
                        }
                    }) : <tr><td colSpan={columns.length}>데이터가 없습니다.</td></tr>}

                    {/* 데이터 추가 영역 */}
                    {isAddRowVisible && (
                        // 동적으로 바꿔야함
                        // 1. columns의 길이만큼만 생성
                        // 2. data[0] 객체에서 column.key와 같은 key의 value값의 type을 구분해서 input, select로 구분하여 추가되도록 하기
                        <tr>
                            {columns.map((column) => {
                                if(typeof data[0][column.key] === "boolean"){
                                    return (
                                        <td key={column.key}>
                                            <select onChange={(e) => addTableRowValueChangeHandler(e, column.key)}>
                                                <option value="">선택안함</option>
                                                <option value="true">O</option>
                                                <option value="false">X</option>
                                            </select>
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td key={column.key}>
                                            <input type="text" onChange={(e) => addTableRowValueChangeHandler(e, column.key)}/>
                                        </td>
                                    );
                                }
                            })}
                        <button onClick={addTableRowButtonClickHandler}>확인</button>
                        <button onClick={()=>setIsAddRowVisible(false)}>취소</button>
                        </tr>
                    )}
                    {!isAddRowVisible && <button onClick={()=>setIsAddRowVisible(true)}>+ 추가</button>}
                </tbody>
            </table>

            {/* 페이징 버튼 영역 */}
            {filteredData.length > 0 && (
                <div>
                    {/* props로 넘겨받은 totalCount를 size로 나눈 몫으로 페이지 처리 */}
                    {(() => {
                        const pages = [];
                        // 나머지가 있는 경우 올림 처리로 한 페이지를 더 생성하기 위해 Math.ceil 사용
                        if(userDataValues.size !== null) //
                        for(let i = 1; i <= Math.ceil(totalCount/userDataValues.size); i++){
                            pages.push(i);
                        }
                        return pages.map((page) => {
                            return(
                                <button key={page} onClick={()=>pageButtonClickHandler(page-1)}>{page}</button>
                            )
                        })
                    })()}
                </div>
            )}

            {/* 임시 모달*/}
            {/* columns를 돌면서 모달 클릭 시 filterModalStates에 저장한 값 중 동일한 key를 가진 column의 정보를 담는 모달 표시 */}
            {columns.map((column) => {
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

export default Table;