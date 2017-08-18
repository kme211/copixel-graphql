import React from "react";
import styled, { keyframes } from "styled-components";

const rainbow = keyframes`
from { 
  filter: hue-rotate(0);
}
to {
  filter: hue-rotate(360deg);
}
`;

const Wrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  flex-wrap: wrap;
  display: flex;
  position: absolute;
  top: 50%;
  right: 0;
  bottom: 0;
  left: 50%;
  margin: -15px 0 -15px;
`;

const Pixel = styled.div`
  height: 20px;
  width: 20px;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-name: ${rainbow};
  animation-timing-function: linear;
  animation-delay: ${props => props.delay}s;
`;

export default () =>
  <Wrapper>
    <Pixel delay="0" style={{ background: "aqua" }} />
    <Pixel delay="0.75" style={{ background: "deeppink" }} />
    <Pixel delay="1.5" style={{ background: "greenyellow" }} />
    <Pixel delay="2.75" style={{ background: "orangered" }} />
  </Wrapper>;
