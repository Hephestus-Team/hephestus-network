import styled from 'styled-components';

export const Input = styled.input`
    width: 100%;
    height: 34px;
    font-size: 16px;
    color: #666;
    border: 0;
    border-bottom: 1px solid ${props => (props.error ? '#F44336' : '#eee')};
`;

export const Label = styled.label`
    color: #acacac;
    font-size: 18px;
    font-weight: bold;
    display: block;
`;

export const ErrorField = styled.p`
    color: #F44336;
    font-size: 14px;
    margin-top: 7px;
`;