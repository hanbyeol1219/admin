import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import OnlyUser from '../pages/OnlyUser';
import Home from '../pages/Home';
import TableSelectPageSize from '../components/common/table/TableSelectPageSize';
import Table from '../components/common/table/TableComp';
import SelectTest from '../components/SelectTest';
// import TableDataFetcher from '../components/common/table/TableDataFetcher';
// import { useContext } from 'react';
// import { DataContext } from '../pages/List';
// import TableAPIURLInputForm from '../components/common/table/TableAPIURLInputForm';


//-----------------------------------페이지 이동 관련
// navigator 함수 목킹
const mockedNavigator = vi.fn();
// → useNavigate 대신 사용할 목킹함수 할당. 
//   해당 함수는 아래 테스트 코드에서 호출 여부 및 호출 파라미터를 테스트하기 위해 전역으로 설정.

// react-router-dom 목킹
vi.mock('react-router-dom', async ()=>({
    ...((await vi.importActual('react-router-dom')) as object),
    useNavigate: () => mockedNavigator
}))
// → vi.mock()으로 react-router-dom 라이브러리를 목킹한 후, 테스트할 속성을 수정.
//   useNavigate 함수를 테스트 할 것이기에 useNavigate를 대체.
//   useNavigate는 화면에서 useNavigate()를 호출하면 함수를 리턴하게 되므로 위와 같이 작성.

describe('페이지 이동', ()=>{
    it('로그인 페이지 이동', async () => {
        // arrange
        const { getByText } = render(<Home />); // App 컴포넌트를 렌더링
        // act
        fireEvent.click(getByText('로그인 페이지 이동')); // 사용자 목록 확인 버튼 클릭
        // assert
        expect(mockedNavigator).toHaveBeenCalledWith('/login'); // useNavigate가 '/list'로 호출되는지 확인
    });
    it('회원 전용 페이지 이동', async () => {
        // arrange
        const { getByText } = render(<Home />); // App 컴포넌트를 렌더링
        // act
        fireEvent.click(getByText('회원 전용 페이지 이동')); // 사용자 목록 확인 버튼 클릭
        // assert
        expect(mockedNavigator).toHaveBeenCalledWith('/only-user'); // useNavigate가 '/list'로 호출되는지 확인
    });
    it('사용자 목록 확인', async () => {
        // arrange
        const { getByText } = render(<OnlyUser />); // App 컴포넌트를 렌더링
        // act
        fireEvent.click(getByText('사용자 목록 확인')); // 사용자 목록 확인 버튼 클릭
        // assert
        expect(mockedNavigator).toHaveBeenCalledWith('/list'); // useNavigate가 '/list'로 호출되는지 확인
    });
});

//------------------------------------select
describe('단순 select 변경 시 기능 동작 test', ()=> {
    it('size 기본 값 확인', ()=>{
        render(<SelectTest />);
        // 기본 선택 값 확인
        expect((screen.getByRole('option', {name : '전체보기'}) as HTMLOptionElement).selected).toBe(true);
    })
    it('select option 개수 확인', ()=> {
        render(<SelectTest />);
        expect(screen.getAllByRole('option').length).toBe(5)
    })
    it('단순 select 변경 test', async ()=>{
        render(<SelectTest />);
        // userEvent.selectOptions(
        //     screen.getByRole('combobox'),
        //     '5',
        // )
        const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
        userEvent.selectOptions(selectElement, ['5개씩 보기']);
        await waitFor(() => {
            expect((screen.getByRole('option', {name: '5개씩 보기'})as HTMLOptionElement).selected).toBe(true);
        });
    });
    
    // it('size 변경1', ()=>{
    //     // arrange
    //     const mockSetTableDataValues = vi.fn();

    //     render(<TableSelectPageSize/>);

    //     // TableDataFetcher의 tableDataValues 
    //     const tableDataValues = {page: 0, size: null as number | null};

    //     // act
    //     // size 변경
    //     fireEvent.change(screen.getByRole('combobox'), {target: {value: '5'}});
    //     // tableDataValues에 변경된 값  반영
    //     tableDataValues.size = 5;

    //     // assert
    //     // size 변경 확인
    //     expect((screen.getByRole('option', {name : '5개씩 보기'}) as HTMLOptionElement).selected).toBe(true);
    //     // size 변경이 tableDataValues에 반영되었는지 확인
    //     expect(tableDataValues.size).toBe(5);
    // })

//     it('size 변경2', async () => {
//         // arrange
//         // TableDataFetcher의 setTableDataValues 사용
//         const tableData = useContext(DataContext);
//         const mockSetTableDataValues = vi.fn();
    
//         // mockSetTableDataValues에 tableData.setTableDataValues를 할당
//         mockSetTableDataValues.mockImplementation(tableData.setTableDataValues);

//         render(<TableSelectPageSize/>);
        
//         const tableDataValues = {page: 0, size: null as number | null}
    
//         // act
//         // size 변경
//         fireEvent.change(screen.getByRole('combobox'), {target: {value: '5'}});
//         // tableDataValues에 변경된 값 반영
//         tableDataValues.size = 5
    
//         // assert
//         // size 변경 확인
//         expect((screen.getByRole('option', {name : '5개씩 보기'}) as HTMLOptionElement).selected).toBe(true)
//         expect(tableDataValues.size).toBe(5)
    
//         // tableDataValues에 변경된 값이 setTableDataValues에 전달되었는지 확인
//         expect(mockSetTableDataValues).toHaveBeenCalledWith(tableDataValues);
//     })

})

//----------------------------------------정렬 관련
describe('리스트 정렬', ()=> {
    const testData =  [
        {
            "userId": "2",
            "name":"test2",
            "address":"test2@test.com",
            "phone": "010-2222-2222",
            "isComplete": "true",
            "isCustomer": "false"
        },
        {
            "userId": "1",
            "name":"test1",
            "address":"test1@test.com",
            "phone": "010-1111-1111",
            "isComplete": "true",
            "isCustomer": "true"
        },
        {
            "userId": "3",
            "name":"test3",
            "address":"test3@test.com",
            "phone": "010-3333-3333",
            "isComplete": "true",
            "isCustomer": "false"
        },
    ]
    it('오름차순 버튼 클릭', async () => {
        // arrange
        // 테스트용 버튼 생성
        const button = document.createElement('button');
        button.textContent = '↑';
        // 버튼 클릭 이벤트 생성
        const fireEvent = new Event('click');
        // 버튼 클릭 시 testData를 조건에 맞게 정렬
        button.addEventListener('click', () => {
            testData.sort((a, b) => {
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            });
        });
        
        // act
        // 버튼 클릭
        button.dispatchEvent(fireEvent);
        // assert
        // 버튼 클릭 후 결과 확인
        expect(testData[0].name).toBe('test1');
    })
    it('내림차순 버튼 클릭', async () => {
        // arrange
        const button = document.createElement('button');
        button.textContent = '↓';
        const fireEvent = new Event('click');
        button.addEventListener('click', () => {
            testData.sort((a, b) => {
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            });
        });
        // act
        button.dispatchEvent(fireEvent);
        // assert
        expect(testData[0].name).toBe('test1');
    })
})


/*
//----------------------------------------API 통신 관련
// 모의 데이터 설정
const mockServerResponse = {
    content: [
      { name: '김', address: '서울', phone: '010-0000-0000' },
      { name: '박', address: '한국', phone: '010-1111-1111' },
    ],
    totalElements: 2,
    totalPages: 1,
};

const mockGetTableData = vi.fn().mockResolvedValue(mockServerResponse);

vi.mock('../../apis/Table', async () => ({
    getTableData: mockGetTableData,
}));

// TableAPIURLInputForm.tsx에서 입력받은 상태 값인 APIURLValue 값과 provider로 가져온 tableData.tableDataValues 값을 
// 이용하여 getTableData함수로 데이터 통신 시 데이터가 정상적으로 불러와지는지 확인하는 테스트 코드 작성
describe('API 통신', ()=> {
    it('사용자로부터 입력받은 api url을 사용하여 데이터 response', async () => {
        // arrange
        const setFilteredData = vi.fn();

        const { getByText, getByPlaceholderText } = render(
            <TableAPIURLInputForm setFilteredData={setFilteredData} />
        );

        const apiUrlInput = getByPlaceholderText('API URL 입력');
        fireEvent.change(apiUrlInput, { target: { value: '/api/v1/admin/user/clients' } });

        // act
        fireEvent.click(getByText('확인'));

        // assert
        expect(mockGetTableData).toHaveBeenCalledWith({
            tableDataValues: { page: 0, size: null },
            APIURLValue: '/api/v1/admin/user/clients',
        });
    });
});
*/

