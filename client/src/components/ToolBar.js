import React from "react";
import styled from "styled-components";
import Icon from "./Icon";
import { BRUSH, ERASER, EYE_DROPPER, PAINT_BUCKET } from "../constants";

const Wrapper = styled.div`
  background: #d8dfe2;
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  @media (min-width: 424px) {
    flex-direction: column;
  }
`;

const Tool = styled.div`
  cursor: pointer;
  padding: 6px;
  background: ${props => (props.active ? "#FC8A15" : "transparent")};
`;

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
}) =>
  <Wrapper>
    <Tool>
      <ColorPicker
        title="color picker"
        type="color"
        name="Color"
        value={currentColor}
        onChange={e => {
          updateColor(e.target.value);
        }}
      />
    </Tool>
    <Tool
      title="pencil"
      active={currentTool === BRUSH}
      data-tool={BRUSH}
      onClick={e => {
        updateTool(BRUSH);
      }}
    >
      <Icon icon="pencil" />
    </Tool>
    <Tool
      title="eraser"
      active={currentTool === ERASER}
      data-tool={ERASER}
      onClick={e => {
        updateTool(ERASER);
      }}
    >
      <Icon icon="eraser" />
    </Tool>
    <Tool
      title="eye dropper"
      active={currentTool === EYE_DROPPER}
      data-tool={EYE_DROPPER}
      onClick={e => {
        updateTool(EYE_DROPPER);
      }}
    >
      <Icon icon="eyedropper" />
    </Tool>
    <Tool
      title="paint bucket"
      active={currentTool === PAINT_BUCKET}
      data-tool={PAINT_BUCKET}
      onClick={e => {
        updateTool(PAINT_BUCKET);
      }}
    >
      <Icon icon="droplet" />
    </Tool>
    <Tool
      title={isGridOn ? "turn grid off" : "turn grid on"}
      onClick={toggleGrid}
    >
      <Icon icon={isGridOn ? "grid_off" : "grid_on"} />
    </Tool>
  </Wrapper>;

export default ToolBar;
