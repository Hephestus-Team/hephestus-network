import styled from 'styled-components';
import { Form as form } from '@unform/web';

export const Form = styled(form)`
    width: 400px;
    margin-top: 30px;
    background-color: #fff;
    padding: 25px;
    box-shadow: 5px 10px 18px #888888;
   
    .input-group-flex + .input-group-flex {
        margin-top: 25px;
    }

    .input-group-flex {
        margin-top: 22px;
        display: flex;
        flex-direction: column;
    }

    label {
        color: #acacac;
        font-size: 18px;
        font-weight: bold;
        display: block;
    }

    input:not([type=radio]) {
        width: 100%;
        height: 34px;
        font-size: 18px;
        color: #666;
        border: 0;
        border-bottom: 1px solid #eee;
    }

    input[type=radio] {
        height: 18px;
        width: 20px;
    }

    input[type=date] {
        max-width: 165px;
    }

    button[type=submit] {
        width: 100%;
        border: 0;
        margin-top: 30px;
        background: #05ade0;
        border-radius: 2px;
        padding: 15px 20px;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        cursor: pointer;
        transition: background 0.5s;
    }

    button[type=submit]:hover {
        background: #1391b8;
    }

    .container-grid{
        margin-top: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
    }

    .radioContainer {
        margin-top: 6px;

        display: flex;
        justify-content: flex-start;
        flex-direction: row;
    }

    .radioContainer label {
        font-size: 15px;
    }

    .radioContainer + .radioContainer {
        margin-left: 10px;
    }

    .container-flex-row {
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
    }
`;
