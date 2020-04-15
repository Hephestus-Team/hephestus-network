import styled from 'styled-components';

export const Container = styled.div`
  display: none;
  position: fixed;
  z-index: 5;
  padding-top: 100px;
  left: 0;
  top: 0;

  width: 100%;
  height: 100%;

  overflow: auto;

  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);

  animation: fadeIn 280ms ease-in-out 1;

  @keyframes fadeIn {
    from {
      background-color: rgba(0, 0, 0, 0);
    }
    to {
      background-color: rgba(0,0,0,0.4);
    }
  }

  div.configContent {
    background-color: #FFF;
    padding: 30px;
    padding-right: 40px;

    margin: 0 auto;
    margin-top: 25px;

    position: relative;

    display: flex;
    flex-direction: column;

    box-shadow: 5px 5px 7px #888888;

    height: max-content;
    width: 550px;
  }

  div.configContent > svg {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  div.configContent div:hover {
    background-color: #F5F6F7;
  }

  div.configContent div + div {
    margin-top: 20px;
  }

  div.configContent div.gridEditting {
    background-color: #F2F2F2;
  }

  div.configContent div.gridEdit {
    display: grid;
    grid-template-columns: 0.7fr 2fr 1fr;
    align-items: center;
    justify-content: center;

    border: 1px solid #ebedf0;
    border-width: 1px 0;
    height: 40px;
    padding: 0 10px;
  }

  div.configContent div.gridEdit p {
    margin-left: 8px;
  }

  div.configContent div.gridEdit button.toEditButton {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    font-size: 16px;
    font-weight: bold;

    height: 100%;
    cursor: pointer;

    border: 0;
    padding: 0;
    background: none;
  }

  div.configContent div.gridEdit button.toEditButton svg {
    margin-right: 10px;
  }

  div.configContent div.gridEdit button.toEditButton p {
    text-decoration: none;
    color: #0366d6;

    font-size: 15px;
  }

  div.configContent div.gridEdit input {
    width: 100%;
    height: 34px;
    font-size: 16px;
    color: #666;
    padding: 0 8px;

    background: none;
    border: 1px solid #ebedf0;
    border-width: 0 1px;
  }

  div.configContent div.editButtons {
    display: flex;
    justify-content: center;
  }

  div.configContent div.editButtons div button {
    border: 0;
    border-radius: 2px;
    background: #fff;
    padding: 6px 12px;

    font-size: 12px;
    color: #05ade0;

    cursor: pointer;
  }

  div.configContent div.editButtons div button:first-child {
    margin-right: 5px;

    background: #05ade0;
    color: #fff;
  }

  div.configContent div.editting {
    padding: 10px;
    background-color: #F2F2F2;
  }

  div.configContent div.editting div {
    display: block;

    margin: 0 auto;
    margin-top: 15px;
    width: fit-content;
  }

  div.configContent div.editting div div {
    width: 100%;
  }

  div.configContent div.editting div div + div {
    margin-top: 20px;
  }

  div.configContent div.editting div div input {
    width: 100%;
    height: 34px;
    font-size: 16px;
    color: #666;
    padding: 0 4px;
    margin-top: 10px;
    background: none;

    border: 0;
    border-bottom: 1px solid #CCC;
  }

  div.configContent div.editting div div.editButtons {
    margin-top: 15px;
  }
`;
