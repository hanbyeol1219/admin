import React from "react";
import Table from "../components/common/table/TableComp";
import TableDataFetcher, { ProviderValueProps, } from "../components/common/table/TableDataFetcher";
import { useLocation } from "react-router-dom";

export const DataContext = React.createContext({} as ProviderValueProps);
export const uniqueKeyContext = React.createContext({} as ProviderValueProps);
 
const List = () => {
    // ---------------routing 관련
    const location = useLocation();

    return(
        <TableDataFetcher>  
            {providerValue => {
                return ( 
                    <div>
                        <h2>공용 컴포넌트 TABLE</h2>
                        {
                            providerValue.tableData &&
                            <DataContext.Provider value={providerValue}>
                                <Table location ={location}/>
                            </DataContext.Provider>
                        }
                        
                    </div>
                )
            }}
        </TableDataFetcher>
    )
}

export default List; 