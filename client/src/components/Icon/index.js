import React from "react";
import styled, { css } from "styled-components";

const styles = ({ size, color }) => css`
  display: inline-block;
  width: ${size ? size / 16 + "rem" : "1em"};
  height: ${size ? size / 16 + "rem" : "1em"};
  box-sizing: border-box;
  margin: 0 ${size ? size / 160 + "rem" : "0.1em"};
  vertical-align: middle;
  color: ${color || "inherit"};
  & > svg {
    width: 100%;
    height: 100%;
    fill: currentcolor;
    stroke: currentcolor;
    & > g path {
      fill: currentColor;
    }
  }
`;

const Wrapper = styled.span`${styles};`;

const Icon = ({ icon, ...props }) => {
  const svg = require(`./icons/${icon}.svg`);
  return <Wrapper {...props} dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default Icon;
