import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 45px;
  height: 45px;
  font-size: 45px;
  line-height: 0.7;
  text-align: center;
  cursor: pointer;
`;

export default props => (
  <Wrapper {...props}>
    ×
  </Wrapper>
);
