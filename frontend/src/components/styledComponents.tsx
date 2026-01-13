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

export const Title = styled.h1`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 3.2em;
  line-height: 1.1;
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
`;

export const Input = styled.input`
  border-radius: 5px;
  padding: 5px;
  font-family: Arial, Helvetica, sans-serif;
  margin: 25px 0;
`;

export const ResponseContainer = styled.div`
  text-align: center;
`;

export const Response = styled.div`
  color: white;
  font-weight: bold;
  size: 35rem;
`;

export const StyledList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const ListItem = styled.li`
  padding: 3px 10px;
  margin: 5px 0;
`;

export const Footer = styled.div`
  margin-top: 30px;
  padding: 20px;
  color: #888;
`;

export const Table = styled.table`
  text-align: left;
  margin: 25px 0;
  th,
  td {
    padding: 3px 15px;
  }
`;
