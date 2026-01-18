import styled from "styled-components";

export const Body = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
`;

export const Logo = styled.img`
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;

  cursor: pointer;
  &:hover {
    filter: drop-shadow(0 0 2em #f9f9ffaa);
  }

  @media (prefers-color-scheme: light) {
    filter: drop-shadow(0 0 0.75em #222222aa);

    &:hover {
      filter: drop-shadow(0 0 2em #222222ff);
    }
  }
`;

export const Title = styled.h1`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 3.2em;
  line-height: 1.1;
`;

export const Input = styled.input`
  border-radius: 5px;
  padding: 5px;
  font-family: Arial, Helvetica, sans-serif;
  margin: 25px 0;
`;

export const Response = styled.div`
  color: white;
  font-weight: bold;
  size: 35rem;
`;

export const ResponseContainer = styled.div`
  text-align: left;
`;

export const Table = styled.table`
  margin: 25px 0;
  th,
  td {
    padding: 3px 15px;
  }
  td {
    color: #c9c9c9;
  }
  width: 100%;

  @media (prefers-color-scheme: light) {
    td {
      color: #555;
    }
  }
`;

export const Footer = styled.div`
  margin-top: 30px;
  padding: 20px;
  color: #888;
`;
