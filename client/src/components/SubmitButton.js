import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  background: #1EE494;
  border: none;
  color: white;
  font-size: inherit;
  transition: background 0.4s;
  cursor: pointer;
  &:hover {
    background: #009378;
  }
`;

const Submit = ({ value, ...props }) => (
  <Wrapper type="submit" value={value} {...props} />
);

export default Submit;