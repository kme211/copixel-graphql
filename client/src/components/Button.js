import styled from "styled-components";

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background: #1EE494;
  border: none;
  color: white;
  font-size: inherit;
  transition: background 0.4s;
  &:hover {
    background: #009378;
  }
`;

export default Button;
