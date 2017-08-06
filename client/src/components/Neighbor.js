import React from "react";
import styled, { css } from "styled-components";
import { BACKGROUNDS } from "../constants";
import PropTypes from 'prop-types';

const styles = ({ top, right, bottom, left, border, width, height, background, direction }) => css`
  position: absolute;
  ${top && `top: ${top};`}
  ${right && `right: ${right};`}
  ${bottom && `bottom: ${bottom};`}
  ${left && `left: ${left};`}
  content: '';
  background: ${background};
  height: ${height}px;
  width: ${width}px;
  display: flex;
  flex-direction: ${direction};
`;

const Wrapper = styled.div`${styles}`;

const pixelStyles = ({ color }) => css`
  flex: 1;
  background: ${color};
`;

const Pixel = styled.div`${pixelStyles}`;

const Neighbor = ({ onClick, centerX, centerY, data, ...props }) => {
  console.log('neigbor', data)
  return (
    <Wrapper
      {...props}
      background={data ? "transparent" : BACKGROUNDS.blankNeighbor}
    >
      {data &&
        data.map((pixel, index) => (
          <Pixel key={`px_${index}`} color={pixel.color} onClick={onClick} data-color={pixel.color} />
        ))}
    </Wrapper>
  );
};

Neighbor.propTypes = {
  onClick: PropTypes.func.isRequired,
  centerX: PropTypes.number.isRequired,
  centerY: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired
}

export default Neighbor;
