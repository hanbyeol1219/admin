import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import  '@testing-library/jest-dom/vitest' 

afterEach(()=>{
    // test 간 DOM 상태를 초기화
    cleanup();
})