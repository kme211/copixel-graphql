import styled, { keyframes } from "styled-components";

const rotateForever = keyframes`
  from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
`;

const LoadingSpinner = styled.div`
  animation-duration: 0.75s;
  animation-iteration-count: infinite;
  animation-name: ${rotateForever};
  animation-timing-function: linear;
  height: 30px;
  width: 30px;
  border: 8px solid black;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  top: 50%;
  right: 0;
  bottom: 0;
  left: 50%;
  margin: -15px 0 -15px;
`;

export default LoadingSpinner;