import styled from "styled-components";

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background: #222;
  border: none;
  color: white;
  font-size: inherit;
  transition: background 0.4s;
  cursor: pointer;
  &:hover {
    background: #302f2f;
  }
`;

export default Button;
