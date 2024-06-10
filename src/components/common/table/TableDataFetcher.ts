import { useState } from "react";

export interface TableDataProps {
    page: number;
    size: number | null;
    keyword?: string;
}

export interface ProviderValueProps {
    tableDataValues: any;
    setTableDataValues: React.Dispatch<React.SetStateAction<TableDataProps>>;
    tableData: any[];
    setTableData: React.Dispatch<React.SetStateAction<any[]>>;
    totalDataCount: number;
    setTotalDataCount: React.Dispatch<React.SetStateAction<number>>;
    columns: {key: string, title: string}[];
    initialTableDataValue: TableDataProps;
    uniqueKey: string;
    setUniqueKey: React.Dispatch<React.SetStateAction<string>>;
    totalDataPages: number;
    setTotalDataPages: React.Dispatch<React.SetStateAction<number>>;
    currentKeyword: string;
    setCurrentKeyword: React.Dispatch<React.SetStateAction<string>>;
}

interface TableDataFetcherProps {
    children: (providerValue: ProviderValueProps) => JSX.Element;
}

const TableDataFetcher = ({children} : TableDataFetcherProps)=>{
    const initialTableDataValue = {
        page: 0,
        size: null
    }
    const [tableDataValues, setTableDataValues] = useState<TableDataProps>(initialTableDataValue)
    const [totalDataCount, setTotalDataCount] = useState<number>(0);
    const [totalDataPages, setTotalDataPages] = useState<number>(0);
    const [uniqueKey, setUniqueKey] = useState("");
    const [currentKeyword, setCurrentKeyword] = useState("");

    // api 통신으로 가져온 데이터를 userList에 담아서 Table 컴포넌트에 넘겨준다.
    const [tableData, setTableData] = useState<any[]>([]);

    // api 통신으로 받아온 데이터가 column을 보고 자리를 찾아갈 수 있도록 key값을 지정
    const columns = [{key: "name", title: "이름"}, {key: "address", title: "주소"}, {key: "phone", title: "전화번호"}];

    const providerValue = {
        tableDataValues, setTableDataValues, tableData, setTableData, 
        totalDataCount, setTotalDataCount, columns, initialTableDataValue,
        uniqueKey, setUniqueKey, totalDataPages, setTotalDataPages,
        currentKeyword, setCurrentKeyword
    }

    return children(providerValue)
}

export default TableDataFetcher;