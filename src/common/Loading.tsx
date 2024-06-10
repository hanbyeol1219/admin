import styled from 'styled-components';
import Spinner from '../assets/spiner.gif'

const Loading = () => {
    return (
        <S.Background>
            <S.Spinner src={Spinner} alt="loading" width="100" height="100"/>
        </S.Background>
    )
}

const S = {
    Background : styled.div`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000000;
        opacity: 0.5;
        z-index: 100;
    `,
    Spinner: styled.img`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `
}

export default Loading;