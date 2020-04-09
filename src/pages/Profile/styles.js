import styled from 'styled-components';

export const PageContainer = styled.div`
  margin: auto;
  margin-top: 20px;

  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 50px;

  aside {
    display: flex;
    flex-direction: column;

    width: 260px;
  }

  aside div {
    display: flex;
    flex-direction: column;

    height: auto;
    margin-top: 15px;
  }

  aside img {
    width: 100%;
    height: 260px;

    background-color: #FFF;

    border-radius: 5px;

    box-shadow: 5px 5px 7px #888888;
  }

  aside div strong {
    margin-top: 15px;

    font-size: 1.4rem;
  }

  aside div p {
    margin-top: 5px;
    font-size: 0.9rem;
  }

  aside .bio {
    margin: 10px 0;
  }

  aside div div svg {
    margin-top: 6px;

    width: 1.3rem;
    height: 1.3rem;
  }

  aside div div {
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
  }

  aside div button {
    margin-top: 15px;

    border: 0;
    border-radius: 3px;
    background: #05ade0;
    padding: 8px 8px;

    font-size: 16px;
    color: #fff;

    cursor: pointer;
  }

  .email input, .birthday input {
    margin-left: 6px;
  }

  aside div div {
    flex-direction: row;
    align-items: center;
  }

  aside div div input, aside div textarea {
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

  aside div textarea {
    resize: vertical;

    height: 90px;
  }

  aside .nameContainer input {
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

  aside .nameContainer input {
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

  main {
    display: flex;
    flex-direction: column;
    align-items: center;

    max-width: 40vw;
  }

  .feed {
    width: 100%;
  }

  .feed .post:first-child {
    margin-top: 0;
  }

  @media only screen and (max-width: 1200px) {
    main {
      width: 35vw;
    }

    aside {
      width: 30vw;
    }
  }

  @media only screen and (max-width: 1000px) {
    aside img {
      width: 200px;
      height: 200px;
    }
  }
`;
