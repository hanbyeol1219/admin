import { useEffect, useState } from "react";
import Table from "../components/common/table/TableComp";

interface UserDataProps {
    page: number;
    size: number | null;
}

interface UserListProps {
    name: string;
    email: string;
    phone: string;
    isComplete: string;
    isCustomer: string;
}


const TestPage = () => {
    //--------------------------------- 테스트용 코드 ---------------------------------

    const [testData, setTestData] = useState<UserListProps[]>([]);

    const columns = [{key: "name", title: "이름"}, {key: "email", title: "이메일"}, {key: "phone", title: "전화번호"}, {key: "isComplete", title: "완료여부"}, {key: "isCustomer", title: "고객여부"}];

    const [userDataValues, setUserDataValues] = useState<UserDataProps>({
        page: 0,
        size: null
    })

    const getTestData = () => {
        fetch('http://localhost:4000/data')
        .then((res) => res.json())
        .then((data) => {
            data.contents.forEach((item:UserListProps) => {
                item.isComplete = JSON.parse(item.isComplete);
                item.isCustomer = JSON.parse(item.isCustomer);
            });
            setTestData(data.contents)
        })
    }

    useEffect(()=>{
        getTestData();
    }, [userDataValues]);

    return(
        <>  
            <div>
                <h2>공용 컴포넌트 TABLE</h2>
                <Table/>
            </div>
        </>
    )
}


export default TestPage;