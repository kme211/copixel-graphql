import React from "react";
import styled, { css } from "styled-components";
import Icon from "./Icon";
import { BRUSH, ERASER, EYE_DROPPER, PAINT_BUCKET } from "../constants";

const Wrapper = styled.div`
  background: #D8DFE2;
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  @media (min-width: 424px) {
    flex-direction: column;
  }
`;

const styles = ({ active }) => css`
  cursor: pointer;
  padding: 6px;
  background: ${active ? "#FC8A15" : "transparent"};
`;

const Tool = styled.div`${styles}`;

const ColorPicker = styled.input`
  width: 30px;
  height: 30px;
  padding: 0;
  margin: 0;
  border: none;
`;

const ToolBar = ({
  isGridOn,
  currentTool,
  currentColor,
  toggleGrid,
  updateTool,
  updateColor
}) => (
  <Wrapper>
    <Tool>
      <ColorPicker
        type="color"
        name="Color"
        value={currentColor}
        onChange={e => {
          updateColor(e.target.value);
        }}
      />
    </Tool>
    <Tool
      active={currentTool === BRUSH}
      data-tool={BRUSH}
      onClick={e => {
        updateTool(BRUSH);
      }}
    >
      <Icon icon="pencil" />
    </Tool>
    <Tool
      active={currentTool === ERASER}
      data-tool={ERASER}
      onClick={e => {
        updateTool(ERASER);
      }}
    >
      <Icon icon="eraser" />
    </Tool>
    <Tool
      active={currentTool === EYE_DROPPER}
      data-tool={EYE_DROPPER}
      onClick={e => {
        updateTool(EYE_DROPPER);
      }}
    >
      <Icon icon="eyedropper" />
    </Tool>
    <Tool
      active={currentTool === PAINT_BUCKET}
      data-tool={PAINT_BUCKET}
      onClick={e => {
        updateTool(PAINT_BUCKET);
      }}
    >
      <Icon icon="droplet" />
    </Tool>
    <Tool onClick={toggleGrid}>
      <Icon icon={isGridOn ? "grid_off" : "grid_on"} />
    </Tool>
  </Wrapper>
);

export default ToolBar;
