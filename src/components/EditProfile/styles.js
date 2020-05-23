import styled from 'styled-components';

export const EditProfileContainer = styled.aside`
  display: flex;
  flex-direction: column;

  width: 260px;

  div {
    display: flex;
    flex-direction: column;

    height: auto;
    margin-top: 15px;
  }

  img {
    width: 100%;
    height: 260px;

    background-color: #FFF;

    border-radius: 5px;

    box-shadow: 5px 5px 7px #888888;
  }

  div strong {
    margin-top: 15px;

    font-size: 1.4rem;
  }

  div p {
    margin-top: 5px;
    font-size: 0.9rem;
  }

  div div svg {
    margin-top: 6px;

    width: 1.3rem;
    height: 1.3rem;
  }

  div div {
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
  }

  div button {
    margin-top: 15px;

    border: 0;
    border-radius: 3px;
    background: #05ade0;
    padding: 8px 8px;

    font-size: 16px;
    color: #fff;

    cursor: pointer;
  }

  div.birthday {
    margin-top: 8px
  }

  .email input, .birthday input {
    margin-left: 6px;
  }

  div div {
    flex-direction: row;
    align-items: center;
  }

  div div input, div textarea {
    margin-top: 10px;

    padding: 5px;
    width: 100%;
    height: 30px;
    font-size: 0.9rem;
    color: #777;
    border: 0;
    border-radius: 3px;

    font-family: Roboto,sans-serif;
  }

  div textarea {
    resize: vertical;

    height: 90px;
  }

  .nameContainer input {
    margin-top: 10px;

    margin-left: 0;

    padding: 5px;
    width: 100%;
    height: 30px;
    font-size: 0.9rem;
    color: #777;
    border: 0;
    border-radius: 3px;

    font-family: Roboto,sans-serif;
  }

  .nameContainer input {
    margin-top: 10px;

    padding: 5px;
    width: 100%;
    height: 30px;
    font-size: 0.9rem;
    color: #777;
    border: 0;
    border-radius: 3px;

    font-family: Roboto,sans-serif;
  }

  .nameContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .email p, .birthday p  {
      margin-left: 5px;
  }

  .editBioContainer {
    width: 100%;
  }

  .editBioContainer div {
    display: flex;
    justify-content: flex-start;
  }

  .editBioContainer div button {
    border: 0;
    border-radius: 2px;
    background: #fff;
    padding: 6px 12px;

    font-size: 12px;
    color: #05ade0;

    cursor: pointer;
  }

  .editBioContainer div button:first-child {
    margin-right: 5px;

    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 12px;

    font-size: 12px;
    color: #fff;

    cursor: pointer;
  }

  .username p {
    color: #888888;
    font-size: 16px;
  }
`;
