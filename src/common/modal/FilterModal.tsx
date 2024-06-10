interface FilterModalProps {
    setFilterStatus: React.Dispatch<React.SetStateAction<{[key: string]: boolean | ""}>>;
    columnKey: string;
}

const FilterModal = ({setFilterStatus, columnKey}:FilterModalProps) => {
    const filterCheckBoxOnChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        // 체크박스 1개만 선택되도록 하기
        const checkBoxes = document.getElementsByName(`${columnKey}filterCheck`) as NodeListOf<HTMLInputElement>;
        for(let i=0; i<checkBoxes.length; i++){
            // 사용자가 누른 체크박스(e.target)와 동일하지 않은 checkBox의 checked 상태 해제
            if(checkBoxes[i] !== e.target){
                checkBoxes[i].checked = false;
            }
        }

        // 어떤 column의 체크박스를 선택했는지에 따라서 filterStatus 변경
        if(e.target.checked){
            setFilterStatus((prev) => ({
                ...prev,
                // 체크박스의 값을 boolean으로 변환 O면 true O가 아니면 false
                [columnKey]: Boolean(e.target.value==="O") 
            }));
        } else {
            setFilterStatus((prev) => ({
                ...prev,
                [columnKey]: ""
            })); 
        }
    };

    return (
        <>
        {   /* 필터링을 위한 체크박스 영역 */}
            <input type="checkbox" id={`${columnKey}isTrue`} name={`${columnKey}filterCheck`} value={"O"} onChange={(e)=>filterCheckBoxOnChangeHandler(e)}/>
            <label htmlFor={`${columnKey}isTrue`}>O만 표시</label>
            <input type="checkbox" id={`${columnKey}isFalse`} name={`${columnKey}filterCheck`} value={"X"} onChange={(e)=>filterCheckBoxOnChangeHandler(e)}/>
            <label htmlFor={`${columnKey}isFalse`}>X만 표시</label>
        </>
    )
}

export default FilterModal;