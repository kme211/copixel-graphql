import React from "react";
import styled from "styled-components";

const Container = styled.div`
  perspective: 1000;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  px: 3;

  &.show-side-back .front {
    transform: rotateX(0);
  }

  &.show-side-back .flipper {
    transform: rotateX(180deg);
  }
`;

const Flipper = styled.div`
  will-change: transform;
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
`;

const Side = styled.div`
  &.front {
    will-change: transform;
  }
  backface-visibility: hidden;
  transition: 0.6s;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  &.back {
    transform: rotateX(180deg);
  }
`;

const FlipperContainer = ({ side, children, ...props }) => {
  const [front, back] = children;

  return (
    <Container className={`show-side-${side}`} {...props}>
      <Flipper className="flipper">
        <Side className="front">
          {front}
        </Side>
        <Side className="back">
          {back}
        </Side>
      </Flipper>
    </Container>
  );
};

export default FlipperContainer;
