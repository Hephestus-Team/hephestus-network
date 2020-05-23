import styled from 'styled-components';

export const PageContainer = styled.div`
  margin: auto;
  margin-top: 20px;

  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 50px;

  main {
    display: flex;
    flex-direction: column;
    align-items: center;

    max-width: 40vw;
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
