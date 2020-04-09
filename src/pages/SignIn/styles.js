import styled from 'styled-components';
import { Form as form } from '@unform/web';

export const Form = styled(form)`
    width: 400px;
    margin-top: 30px;
    background-color: #fff;
    padding: 25px;
    box-shadow: 5px 10px 18px #888888;

    input {
        margin-top: 10px;
    }

    .input-group-flex {
        margin-top: 25px;
        display: flex;
        flex-direction: column;
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

    .registerContainer {
        margin-top: 20px;
        padding: 12px;
        border: 1px solid #d8dee2;
        border-radius: 5px;

        display: flex;
        justify-content: center;
    }

    .registerContainer a {
        text-decoration: none;
        color: #0366d6;
    }
`;
