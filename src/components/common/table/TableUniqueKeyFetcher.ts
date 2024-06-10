import { useState } from "react";

export interface ProviderValueProps {
    uniqueKey: string;
    setUniqueKey: React.Dispatch<React.SetStateAction<string>>;
}

interface TableDataFetcherProps {
    children: (providerValue: ProviderValueProps) => JSX.Element;
}

const TableUniqueKeyFetcher = ({children} : TableDataFetcherProps)=>{
    const [uniqueKey, setUniqueKey] = useState("");
    const providerValue = {uniqueKey, setUniqueKey}
    
    return children(providerValue)
}

export default TableUniqueKeyFetcher;